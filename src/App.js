import './App.css';
import {useState, useEffect, useRef} from 'react'
function App() {
  const [data, setData] = useState([])
  const [employee, setEmployee] = useState([])
  const [bestEmployees, setBestEmployees] = useState([])
  const [result, setResult] = useState()
  var up = useRef()
  const showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const lines = e.target.result.split(/\r\n|\n/);
      setData(lines)
    };
    reader.readAsText(e.target.files[0])
  }

  useEffect(()=>{
    var today = new Date().getFullYear() + "-"+ new Date().getMonth() + "-" + new Date().getDate()
    data.map((element) => {
      setEmployee((employee) => [...employee,
        {
          "Project_id": element.split(", ")[1],
          "emp_id" : element.split(', ')[0],
          "days": parseInt((new Date(element.split(", ")[3] == "NULL" ? today : element.split(", ")[3]).getTime() -  new Date(element.split(", ")[2]).getTime())/(1000 * 3600 * 24)),
          'daysFrom': element.split(", ")[2],
          'daysTo': element.split(", ")[3] == "NULL" ? today : element.split(", ")[3]
        }
      ])
    })
  },[data])

  const CheckProjects = (id) => {
    let projects = employee.filter(item => item.Project_id == id)
    let theBest = {
      "emp1": 0,
      "emp2": 0,
      "days": 0,
      "project": 0
    }
    for (let i = 0; i < projects.length; i++) {
      let comp = projects[i]
      projects.map((pr,index) => {
        if(index != i){
          let daysTo = new Date(comp.daysTo).getTime() < new Date(pr.daysTo).getTime() ? new Date(comp.daysTo) : new Date(pr.daysTo)
          let daysFrom = new Date(comp.daysFrom).getTime() > new Date(pr.daysFrom).getTime() ? new Date(comp.daysFrom) : new Date(pr.daysFrom)
          let daysTogether = (daysTo.getTime() - daysFrom.getTime() )/(1000 * 3600 * 24)
          if(daysTogether > 0 && daysTogether > theBest.days){
            theBest = {
              "emp1": comp.emp_id,
              "emp2": pr.emp_id,
              "days": daysTogether,
              "project": id
            }
          }
        }
      })
    }
    return theBest;
  }

  useEffect(()=>{
    var pr_ids = []
    data.map((element) => {
      pr_ids.push(element.split(", ")[1])
    })
    pr_ids = pr_ids.filter((item, pos, self) => {
      return pr_ids.indexOf(item) == pos;
    });
    pr_ids.map(id => setBestEmployees((bestEmployees)=> [...bestEmployees,CheckProjects(id)]))
  },[employee])

  useEffect(()=>{
    var best = bestEmployees.filter((o) => { return o.days === Math.max(...bestEmployees.map((o)=> { return o.days; }))})
    setResult(best)
    console.log(best);
  },[bestEmployees])

  return (
    <div className="App">
      <div className="App-header">
        <button className="Select-action" type="button" onClick={() => up.click()}>Select File</button>
        <input style={{display:"none"}} type="file" ref={(ref) => up = ref} onChange={(e) => showFile(e)} />
        <div className="Grid">
          <div className={result && result.length !== 0 ? "Grid-head" : "Hide"}>
            <div>
              <p>Employee ID #1</p>
            </div>
            <div>
              <p>Employee ID #2</p>
            </div>
            <div>
              <p>Project ID</p>
            </div>
            <div>
              <p>Days worked</p>
            </div>
          </div>
          {
            result !== undefined ?
              result.map((res,index) =>
                <div key={index} className="Grid-line">
                  <div>
                    <p>{res.emp1}</p>
                  </div>
                  <div>
                    <p>{res.emp2}</p>
                  </div>
                  <div>
                    <p>{res.project}</p>
                  </div>
                  <div>
                    <p>{res.days}</p>
                  </div>
                </div>
              )
            : ""
          }
        </div>
      </div>
    </div>
  );
}

export default App;
