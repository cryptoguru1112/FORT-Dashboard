import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import {useState} from "react";
import data from "../../tests/data.json";
import {useRecoilValue} from "recoil";
import {totalTxVolumeAtom} from "../../state/options/updateTotalTxVolume";

const Options = () => {
  const [tData] = useState(data);
  const totalTxVolume = useRecoilValue(totalTxVolumeAtom({}))

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 3]} spacing="44px">
        <Norm value={totalTxVolume.toFixed(2)} desc={"Total Transaction Volume (DCU)"} color={"#C7A072"}/>
        <Norm value={tData.options.curCallOptionPositionsETH} desc={"Current Call Option Positions (DCU)"} color={"#00B388"}/>
        <Norm value={tData.options.curShortOptionsETH} desc={"Current Short Option Positions (DCU)"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={"44px"}>
        <LineChart title={"Total Transaction Volume"} total={382992} data={tData.options.totalTransactionVolumeList}/>
        <LineChart title={"Total Trading Volume"} total={233323} data={tData.options.totalTradingVolumeList}/>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing="44px">
        <PieChart title={"Long-Short Distribution"} data={tData.options.longShortDistribution}/>
        <PieChart title={"Distribution of Exercise Timespan"} data={tData.options.distributionOfExerciseTimespan}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Options
