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

  const attractionsRef = collection(db, "attractions")

  async function getData(queryRef) {
    const querySnapshot = await getDocs(queryRef)
    const attractionList = querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id }
    })

    setAttractions(attractionList)
    return attractionList
  }

  function makeStatistic(attractionList) {
    let countAll = 0, priceAll = 0;
    const stat = attractionList.reduce((obj, item) => {
      const { settlement, price } = item
      countAll++;
      priceAll += price;
      obj[settlement] = obj[settlement]
        ? { count: obj[settlement].count + 1, price: obj[settlement].price + price }
        : { count: 1, price }
      return obj
    }, {})

    setStatistic(stat)
    setSum([countAll, Math.round(priceAll / countAll) || 0])
  }

  useEffect(() => {
    getData(attractionsRef).then(makeStatistic)
  }, [])

  function handleDelete(id) {
    deleteDoc(doc(db, "attractions", id))
      .then(() => getData(attractionsRef))
      .then(makeStatistic)
  }

  function handleChange(event) {
    const value = event.target.value
    if (value === "") {
      getData(attractionsRef)
    } else {
      const queryRef = query(attractionsRef, where("settlement", "==", value))
      getData(queryRef)
    }
  }

  function handleCheckChange(event) {
    const checked = event.target.checked
    if (checked) {
      const queryRef = query(attractionsRef, where("category", "==", "étterem"))
      getData(queryRef)
    } else {
      getData(attractionsRef)
    }
  }

  return (
    <main className={"container"}>
      <h1>Látványosságok</h1>

      <Link className="btn btn-primary m-2" to="/attraction/new">
        Felvitel
      </Link>

      <Select name="settlement" handleChange={handleChange} label="Település">
        <option value="">Válassz..</option>
        {Object.keys(statistic).map(settlement  => (
          <option key={settlement} value={settlement}>
            {settlement}
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
          {Object.keys(statistic).map(settlement => (
            <tr key={settlement}>
              <td>{settlement}</td>
              <td>{statistic[settlement].count}</td>
              <td>{Math.round(statistic[settlement].price / statistic[settlement].count)}</td>
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
