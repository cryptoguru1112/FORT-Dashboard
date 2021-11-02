import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";
import {web3} from "../../provider";

export const totalTxVolumeAtom = atomFamily({
  key: "options-totalTxVolume::value",
  default: selectorFamily({
    key: "options-totalTxVolume::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateTotalTxVolume(txList)
    }
  })
})

const updateTotalTxVolume = (txList: Block[]) => {
  let totalTxVolume = 0

  txList.map((block) => {
    const func = block.input.slice(0,10)
    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))

      totalTxVolume += Number(web3.utils.fromWei(parameters[4]))
    }
  })
  return totalTxVolume
}

export default updateTotalTxVolume