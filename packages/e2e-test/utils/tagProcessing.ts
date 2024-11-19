import { randomUUID } from "crypto"
import ASN from "./asn"
import PTIURN from "./ptiurn"
import type Bichard from "./world"

const tags = ["PTIURN", "PersonGivenName1", "PersonGivenName2", "PersonFamilyName", "ProsecutorReference"]

const getNewName = (list: string[][], oldName: string) => {
  for (let i = 0; i < list.length; i += 1) {
    if (list[i][0] === oldName) {
      return list[i][1]
    }
  }

  return ""
}

const extractTags = function (world: Bichard, message: string, tag: string) {
  if (!world) {
    return
  }

  const bits = message.split(`${tag}>`)
  if (bits.length < 3) {
    return
  }

  for (let i = 1; i < bits.length; i += 2) {
    const name = bits[i].substring(0, bits[i].length - 2)
    const newName =
      randomUUID().toString().substr(0, 8).toUpperCase() + randomUUID().toString().substr(0, 4).toUpperCase() // if string is too long, it fudges the PNC

    if (tag === "PersonFamilyName") {
      world.currentTestFamilyNames.push([name, newName])
    } else if (tag === "PersonGivenName1") {
      world.currentTestGivenNames1.push([name, newName])
    } else if (tag === "PersonGivenName2") {
      world.currentTestGivenNames2.push([name, newName])
    } else if (tag === "ProsecutorReference") {
      const asn = new ASN(name)
      asn.randomiseSequence()
      world.currentProsecutorReference.push([name, asn.toString()])
    } else if (tag === "PTIURN") {
      const ptiurn = new PTIURN(name)
      ptiurn.randomiseSequence()
      world.currentPTIURNValues.push([name, ptiurn.toString()])
    }
  }
}

export const extractAllTags = function (world: Bichard, message: string) {
  for (let i = 0; i < tags.length; i += 1) {
    extractTags(world, message, tags[i])
  }
}

const replaceTags = (world: Bichard, message: string, tag: string) => {
  const bits = message.split(`${tag}>`)
  if (bits.length < 2) {
    return message
  }

  let newMessage = `${bits[0]}`
  for (let i = 1; i < bits.length; i += 2) {
    const name = bits[i].substring(0, bits[i].length - 2)
    let newName = name
    if (tag.includes("PTIURN")) {
      newName = getNewName(world.currentPTIURNValues, name)
    } else if (tag.includes("PersonFamilyName")) {
      newName = getNewName(world.currentTestFamilyNames, name)
    } else if (tag.includes("PersonGivenName1")) {
      newName = getNewName(world.currentTestGivenNames1, name)
    } else if (tag.includes("PersonGivenName2")) {
      newName = getNewName(world.currentTestGivenNames2, name)
    } else if (tag.includes("ProsecutorReference")) {
      newName = getNewName(world.currentProsecutorReference, name)
    }

    newMessage = `${newMessage}${tag}>${newName}</${tag}>${bits[i + 1]}`
  }

  return newMessage
}

export const replaceAllTags = (world: Bichard, message: string, prefix = "") => {
  let resultMessage = message
  for (let i = 0; i < tags.length; i += 1) {
    resultMessage = replaceTags(world, resultMessage, prefix + tags[i])
  }

  return resultMessage
}

export const updateExpectedRequest = function (expectedRequest: string, world: Bichard) {
  let result = expectedRequest

  for (let i = 0; i < world.currentTestFamilyNames.length; i += 1) {
    let COU = `${world.currentTestFamilyNames[i][0]}/${world.currentTestGivenNames1[i][0]}`.toUpperCase()
    let newCOU = `${world.currentTestFamilyNames[i][1]}/${world.currentTestGivenNames1[i][1]}`.toUpperCase()
    if (newCOU.length > COU.length) {
      COU += " ".repeat(newCOU.length - COU.length)
    } else {
      newCOU += " ".repeat(COU.length - newCOU.length)
    }

    result = result.replace(COU, newCOU)

    let IDS = world.currentTestFamilyNames[i][0].toUpperCase().substr(0, 12)
    let newIDS = world.currentTestFamilyNames[i][1].toUpperCase()
    if (newIDS.length > IDS.length) {
      IDS += " ".repeat(newIDS.length - IDS.length)
    } else {
      newIDS += " ".repeat(IDS.length - newIDS.length)
    }

    result = result.replace(IDS, newIDS)
  }

  // ASN number
  for (let i = 0; i < world.currentProsecutorReference.length; i += 1) {
    let oldASN = world.currentProsecutorReference[i][0].substring(world.currentProsecutorReference[i][0].length - 7)
    const newASN = world.currentProsecutorReference[i][1].substring(world.currentProsecutorReference[i][1].length - 7)
    oldASN = oldASN.replace(/^0+/, "").padEnd(newASN.length, " ")
    result = result.replace(new RegExp(oldASN, "g"), newASN)
  }

  return result
}
