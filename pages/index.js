import { useState } from "react"
import { useStateValidator, useValidate } from "react-indicative-hooks"
import { useValidateAll } from "react-indicative-hooks"
import { create } from "ipfs-http-client"
import { Box, Button, Container, Text, Heading, HStack, Input, Spacer, Image, Spinner, Link } from '@chakra-ui/react'

const client = create("https://ipfs.infura.io:5001/api/v0")

export function getStaticProps() { 
  console.log("Running getstaticProps....")
  return {
    props: {
      time: new Date().toString()
    },
    revalidate: 60
  }
}

export default function Home({ time }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [showError, setShowError] = useState(false)
  const [showOtherError, setShowOtherError] = useState(false)
  const [hasChosenImage, setHasChosenImage] = useState(false)
  const [hasChosenVideo, setHasChosenVideo] = useState(false)
  const [hasChosenAudio, setHasChosenAudio] = useState(false)
  const [hasChosenJson, setHasChosenJson] = useState(false)
  const [fileUrlImage, updateFileUrlImage] = useState("")
  const [fileUrlVideo, updateFileUrlVideo] = useState("")
  const [fileUrlAudio, updateFileUrlAudio] = useState("")
  const [fileUrlJson, updateFileUrlJson] = useState("")
  const data = []

  const rules = {
    name: "required",
    email: "required|email"
  }

  const messages = {
    "name.required": "Please enter your name",
    "email.required": "Please enter your email",
    "email.email": "Please enter a valid email"
  }

  const otherRules = "required"

  const otherMesssages = {
    required: "Please input your data"
  }

  const options = {
    messages,
    onSuccess: () => setShowError(false),
    onError: () => setShowError(true)
  }

  const otherOptions = {
    otherMesssages,
    onSuccess: () => setShowOtherError(false),
    onError: () => setShowOtherError(true)
  }

  const errorValidate = useValidate({ name, email }, rules, options)
  const errorValidateAll = useValidateAll({ name, email }, rules, options)
  const [value, setValue, error] = useStateValidator("", otherRules, otherOptions)

  async function onChangeImage(e) {
    setHasChosenImage(true)
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      updateFileUrlImage(url)
      data.push({
        "image": added.path
      })
      const dataJson = JSON.stringify(data)
      console.log(data)
      const blob = new Blob([dataJson], { type: 'application/json' })
      const jsonFile = new File([ blob ], 'file.json')
      const otherAdded = await client.add(jsonFile)
      const otherUrl = `https://cloudflare-ipfs.com/ipfs/${otherAdded.path}`
      console.log(otherAdded)
      console.log("cid: " + otherAdded.cid)
      console.log("url: " + otherUrl)
      updateFileUrlJson(otherUrl)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function onChangeVideo(e) {
    setHasChosenVideo(true)
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      updateFileUrlVideo(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function onChangeAudio(e) {
    setHasChosenAudio(true)
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      updateFileUrlAudio(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function onChangeJson(e) {
    setHasChosenJson(true)
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      updateFileUrlJson(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  function revalidate() {
    fetch('/api/revalidate')
  }

  return (
    <Box mt={8}>
      <Container maxW="container.xl">
        <Heading mb={8}>React Indicative Hooks</Heading>
        <Heading size="xl" mb={4}>useValidate()</Heading>
        <Heading size="xl" mb={4}>useValidateAll()</Heading>
        <Text color="red" mb={4}>
          {showError && "Check out the errors below:"}
        </Text>
        <HStack mb={4}>
          <Input
            value={name}
            onChange={e => setName(e.target.value)} />
          <Spacer />
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)} /> 
        </HStack>
        <Text color="red" mb={2}>
          {errorValidate && "useValidate: " + errorValidate.message}
        </Text>
        <Text color="red" mb={4}>
          {errorValidateAll && "useValidateAll: " + errorValidateAll.map(error => error.message).join(", ")}
        </Text>
        <Heading size="xl" mb={4}>useStateValidator()</Heading>
        <Text color="red" mb={4}>
          {showOtherError && "Check out the errors below:"}
        </Text>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          mb={2} />
        <Text color="red" mb={8}>
          {error && "useStateValidator: " + error.message}
        </Text>
        <Heading size="xl" mb={4}>IPFS Upload</Heading>
        <Text>Image</Text>
        <Input
          type="file"
          onChange={onChangeImage}
          mb={4} />
        {
          (!fileUrlImage && hasChosenImage === true) ? (
            <Spinner />
           ) : null
        }    
        {
          fileUrlImage && (
            <Box>
              <Image src={fileUrlImage} w="full" h="800px" />
              <Link as="a" href={fileUrlJson} target="_blank">
                Go to the link of json metadata
              </Link>
            </Box>
          )
        }
        <Text>Video</Text>
        <Input
          type="file"
          onChange={onChangeVideo}
          mb={4} />
        {
          (!fileUrlVideo && hasChosenVideo === true) ? (
            <Spinner />
           ) : null
        }    
        {
          fileUrlVideo && (
            <video width="320" height="240" controls>
              <source src={fileUrlVideo} type="video/mp4" />
              <source src={fileUrlVideo} type="video/mov" />
              Your browser does not support the video tag.
            </video>
          )  
        }
        <Text>Audio</Text>
        <Input
          type="file"
          onChange={onChangeAudio}
          mb={4} />
        {
          (!fileUrlAudio && hasChosenAudio === true) ? (
            <Spinner />
           ) : null
        }  
        {
          fileUrlAudio && (
            <audio width="320" height="240" controls>
              <source src={fileUrlAudio} type="audio/mp3" />
              Your browser does not support the video tag.
            </audio>
          )
        }
        <Text>Metadata</Text>
        <Input
          type="file"
          onChange={onChangeJson}
          mb={4} />
        {
          (!fileUrlJson && hasChosenJson === true) ? (
            <Spinner />
           ) : null
        }  
        {
          fileUrlJson && (
            <Link as="a" href={fileUrlJson} target="_blank">
              Go to the link of json metadata
            </Link>
          )
        }
        <Heading size="xl" mt={8} mb={2}>Static Regeneration</Heading>
        <Text mb={2}>{time}</Text>
        <Button onClick={() => revalidate()} mb={16}>Revalidate</Button>
      </Container>
    </Box>
  )
}
