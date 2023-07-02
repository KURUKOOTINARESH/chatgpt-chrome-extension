import './App.css';
import Extension from './components/extension';
import { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function App() {
  const [status,setStatus] = useState<String>("Initial")
  const activeTab = useSelector((state:any) => state.activeTab);

  useEffect(()=>{
    activeTab.then((data:any)=>{
      if(data.url?.includes("youtube.com/watch")){
        setStatus("youtube")
      }
      else{
        setStatus("Initial")
      }
    })
  })

  const getContent=(status:String)=>{
    switch(status){
      case "Initial":
        return <p>This is not a Youtube video page</p>
      case "youtube":
        return <Extension/>
    }
  }

  return (
    <div className="App">
      {getContent(status)}
    </div>
  );
}

export default App;
