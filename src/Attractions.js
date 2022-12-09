import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import db from "./firebase/db"
import { collection, deleteDoc, getDocs, doc, query, where } from "firebase/firestore"

import Select from "./components/Select"
import CheckBox from "./components/CheckBox"

export default function Attractions() {
  const [attractions, setAttractions] = useState([])
  const [statistic, setStatistic] = useState([])
  const [sum, setSum] = useState([0, 0])
  const [settlement, setSettlement] = useState('')
  const [restaurant, setRestaurant] = useState(false)

  const attractionsRef = collection(db, "attractions")

  async function getData() {
    const querySnapshot = await getDocs(getQuery())
    const attractionList = querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id }
    })

    setAttractions(attractionList)
    return attractionList
  }

  function getQuery() {
    if (settlement && restaurant) {
      return query(attractionsRef, where("settlement", "==", settlement),  where("category", "==", "étterem"))
    } 
    if (settlement) {
      return query(attractionsRef, where("settlement", "==", settlement))
    } 
    if (restaurant) {
      return query(attractionsRef, where("category", "==", "étterem"))
    } 
    return attractionsRef
  }

  function makeStatistic(attractionList) {
    const settlementList = attractionList.map(item => item.settlement)
    let settlements = []
    for (const settlement of settlementList) {
      if (!settlements.includes(settlement)) {
        settlements.push(settlement)
      }
    }
    let countAll = 0;
    let priceAll = 0;
    const stat = settlements.map(settlement => {
      const cities = attractionList.filter(item => item.settlement === settlement)
      const count = cities.length;
      const price = cities.reduce((sum, item) => sum + parseInt(item.price), 0)
      countAll += count
      priceAll += price
      return {
        name: settlement,
        count,
        price
      }
    })
    setStatistic(stat)
    setSum([countAll, Math.round(priceAll / countAll) || 0])
  }

  useEffect(() => {
    getData().then(makeStatistic)
  }, [])

  useEffect(() => {
    getData()
  }, [settlement, restaurant])

  function handleDelete(id) {
    deleteDoc(doc(db, "attractions", id))
      .then(() => getData(attractionsRef))
      .then(makeStatistic)
  }

  function handleChange(event) {
    setSettlement(event.target.value)
  }

  function handleCheckChange(event) {
    setRestaurant(event.target.checked)
  }

  return (
    <main className={"container"}>
      <h1>Látványosságok</h1>

      <Link className="btn btn-primary m-2" to="/attraction/new">
        Felvitel
      </Link>

      <Select name="settlement" handleChange={handleChange} label="Település">
        <option value="">Válassz..</option>
        {statistic.map(settlement  => (
          <option key={settlement.name} value={settlement.name}>
            {settlement.name}
          </option>
        ))}
      </Select>

      <CheckBox label="Csak éttermek" name="restaurant" handleChange={handleCheckChange} />

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Megnevezés</th>
            <th>Település</th>
            <th>Cím</th>
            <th>Kategória</th>
            <th>Ár</th>
            <th>Megjegyzés</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {attractions.map((attraction, index) => (
            <tr key={index}>
              <td>{attraction.name}</td>
              <td>{attraction.settlement}</td>
              <td>{attraction.address}</td>
              <td>{attraction.category}</td>
              <td>{attraction.price}</td>
              <td>{attraction.note}</td>
              <td>
                <button
                  id={"delete-" + attraction.id}
                  className="btn btn-danger me-3"
                  onClick={() => handleDelete(attraction.id)}
                >
                  Törlés
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Település</th>
            <th>Látványosságok</th>
            <th>Átlag ár</th>
          </tr>
        </thead>
        <tbody>
          {statistic.map(settlement => (
            <tr key={settlement.name}>
              <td>{settlement.name}</td>
              <td>{settlement.count}</td>
              <td>{Math.round(settlement.price / settlement.count)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Összegzés</th>
            <td>{sum[0]}</td>
            <td>{sum[1]}</td>
          </tr>
        </tfoot>
      </table>
    </main>
  )
}
