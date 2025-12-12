import EnergyProductionCard from "./EnergyProductionCard";

const EnergyProductionCards = (props) => {

    if (props.energyProductionData.length === 0) {
        return <p className="mt-4 text-gray-500">No data available for the selected filter.</p>;
    }
    
    return (
       <div className="mt-4 grid grid-cols-7 gap-4">
               {props.energyProductionData.map((e1) => {
                return (
                <EnergyProductionCard
                key={e1.date} //unique key prop for each component to uniquely identify it
                day={e1.day}
                date={e1.date}
                Production={e1.Production}
                hasAnomaly={e1.hasAnomaly}
               />
               );
            })}

            </div>
    )
}


export default EnergyProductionCards;