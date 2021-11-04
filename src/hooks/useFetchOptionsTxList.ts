import {optionsContractAddress} from "../constant/contract";
import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import {optionsTxListAtom} from "../state/options";
import fetcher from "../utils/fetcher";
import {etherscanEndpoint} from "../constant/etherscan";
import {IDLE, PROCESSING} from "../constant/status";

const env = process.env.REACT_APP_ENV || "mainnet"
const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY2 || process.env.REACT_APP_ETHERSCAN_APIKEY

export const statusAtom = atom({
  key: "fetch-options::status",
  default: IDLE,
})

const useFetchOptionsTxList = () => {
  const address = (env === "mainnet") ? optionsContractAddress["mainnet"] : optionsContractAddress["rinkeby"]
  const api = ( env === "mainnet" ) ? etherscanEndpoint["mainnet"] : etherscanEndpoint["rinkeby"]

  const [optionsTxList, setOptionsTxList] = useRecoilState(optionsTxListAtom)
  const [status, setStatus] = useRecoilState(statusAtom)

  useEffect(() => {
    fetchAllTx()
  }, [])

  async function fetchTxList(startblock = "0",
                             endblock = "latest",
                             sort = "asc") {
    const res = await fetcher(api + "api?module=account&action=txlist&startblock=" + startblock
      + "&endblock=" + endblock
      + "&page=1&offset=10000&sort=" + sort
      + "&address=" + address
      + "&apiKey=" + apiKey)
    return res.result
  }

  async function fetchAllTx() {
    let blockHigh = 0
    let res: never[] = []

    setStatus(PROCESSING)
    while(res.length % 10000 === 0 ){
      let request
      request = await fetchTxList(String(blockHigh), "latest")
      blockHigh = request[request.length - 1].blockNumber
      res = res.concat(request)
    }
    setOptionsTxList(res)
    setStatus(IDLE)
  }
}

export default useFetchOptionsTxList
