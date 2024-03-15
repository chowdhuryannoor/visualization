import { useState, useEffect } from 'react'
import ScreePlot from './componants/ScreePlot'
import Loadings from './componants/Loadings'
import ScatterPlotMatrix from './componants/ScatterPlotMatrix';
import KCluster from './componants/KCluster';
import * as d3 from "d3";
import BiPlot from './componants/Biplot';

const compute_loadings = function (componants, eigenindex) {
	//calculate the loadings
	const sortedComponants = componants.map((componant) => {
		let loading = 0
		for (let i = 1; i <= eigenindex; i++){
			let square = componant[`pc${i}`] * componant[`pc${i}`]
			loading += square
		}
		componant['loading'] = loading
		return componant
	})

	//sort the loadings
	return sortedComponants.sort((a, b) => b.loading - a.loading)
}

function App() {
	const [componants, setComponents] = useState([]);
	const [pcVectors, setPcVectors] = useState([]);
	const [original, setOriginal] = useState([]);
	const [kLabels, setKLabels] = useState([]);

	const [eigenindex, setEigenindex] = useState(2);
	const [kValue, setKValue] = useState(4);

	//Load the data when the app starts
	useEffect(() => {
		d3.csv("../data/components.csv", function (d) {
			return {
				"Attribute": d['Attribute'],
				"pc1": +d['pc1'],
				"pc2": +d['pc2'],
				"pc3": +d['pc3'],
				"pc4": +d['pc4'],
				"pc5": +d['pc5'],
				"pc6": +d['pc6'],
				"pc7": +d['pc7'],
				"pc8": +d['pc8'],
				"loading": 0
			}
		}).then((d) => {
			setComponents(compute_loadings(d, 2));
		});

		d3.csv("../data/pc_vectors.csv", function (d) {
			return {
				'pc1': +d['pc1'],
				'pc2': +d['pc2'],
				'pc3': +d['pc3'],
				'pc4': +d['pc4'],
				'pc5': +d['pc5'],
				'pc6': +d['pc6'],
				'pc7': +d['pc7'],
				'pc8': +d['pc8'],

			}
		}).then((d) => {
			setPcVectors(d);
		})

		d3.csv("../data/original.csv", function (d){
			return {
				'buildUpPlaySpeed': +d['buildUpPlaySpeed'],
				'buildUpPlayPassing': +d['buildUpPlayPassing'],
				'chanceCreationPassing': +d['chanceCreationPassing'],
				'chanceCreationCrossing': +d['chanceCreationCrossing'],
				'chanceCreationShooting': +d['chanceCreationShooting'],
				'defencePressure': +d['defencePressure'],
				'defenceAggression': +d['defenceAggression'],
				'defenceTeamWidth': +d['defenceTeamWidth']
			}
		}).then((d) => {
			setOriginal(d);
		})

		d3.csv("../data/cluster_lables.csv", function (d){
			return {
				'k1': +d['k1'],
				'k2': +d['k2'],
				'k3': +d['k3'],
				'k4': +d['k4'],
				'k5': +d['k5'],
				'k6': +d['k6'],
				'k7': +d['k7'],
				'k8': +d['k8'],
				'k9': +d['k9'],
				'k10': +d['k10'],
			}
		}).then((d) => {
			let k_array = []
			for (let i = 1; i <= 10; i++){
				k_array.push(d.map((d) => d[`k${i}`]))
			}
			setKLabels(k_array)
		})
	}, []);

	//calculate the loadings based on eigenindex
	useEffect(() => {
		setComponents(compute_loadings(componants, eigenindex))

	}, [eigenindex])

	const handleEigenIndex = (index) => setEigenindex(index)
	const handleKValue = (k) => setKValue(k)

	return (
		<div id="container_main">
			<div id="container_left">
				<Loadings data={componants.slice(0,4)}/>
				<BiPlot data={pcVectors} labels={kLabels[kValue]} />
			</div>
			<div id="container_middle">
				<ScreePlot eigenindex={eigenindex} handleEigenIndex={handleEigenIndex}/>
				<KCluster kValue={kValue} handleKValue={handleKValue}/>
			</div>
			<div id="container_right">
				<ScatterPlotMatrix 
					data={original} 
					labels={kLabels[kValue]} 
					attrs={componants.slice(0, 4)}
				/>
			</div>
		</div>
	)
}

export default App
