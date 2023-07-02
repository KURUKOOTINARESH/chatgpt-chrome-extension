import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import chatgptImg from "../assets/chatgpt.png";
import { v4 as uuidv4 } from "uuid";
import { MdDelete } from "react-icons/md";

const Chatgpt = () => {
  const bigContentDataRes = JSON.parse(localStorage.getItem("bigContentData")!);
  const initailBigData = bigContentDataRes ? bigContentDataRes : [];
  const [bigContentData, setBigContentData] = useState<any[]>(initailBigData);

  let entryContent;
  let entryId;
  if (bigContentDataRes) {
    const n = bigContentDataRes.length;
    entryContent = bigContentDataRes[n - 1].entry;
    entryId = bigContentDataRes[n - 1].id;
  }

  const initialData = entryContent ? entryContent : [];
  const id_ = entryId ? entryId : "";
  const [data, setData] = useState<any[]>(initialData);
  const [msg, setMsg] = useState<string>();
  const [refresh, setRefresh] = useState<Boolean>(false);
  const [chatDataId, setChatDataId] = useState<string>(id_);
  const [error,setError] = useState<string>('')

  const onClosechatGpt = () => {
    const modalContainer = document.querySelector(".extension-modal");
    if (modalContainer) {
      modalContainer.remove();
    }
  };

  const callApi = async () => {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        msg,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((resData) => {
        data.push({ id: data.length + 1, msg: resData.msg, question: msg });

        if (bigContentData.length !== 0) {
          const newBigData = bigContentData.map((eachEntry: any) => {
            if (eachEntry.id === chatDataId) {
              return { ...eachEntry, entry: data };
            }
            return eachEntry;
          });
         

          setData(data);
          setBigContentData(newBigData);
          localStorage.setItem("bigContentData", JSON.stringify(newBigData));
        } else {
          const newEntry = {
            id: uuidv4(),
            entry: data,
          };
          bigContentData.push(newEntry);
          localStorage.setItem(
            "bigContentData",
            JSON.stringify(bigContentData)
          );
          setData(data);
          setBigContentData(bigContentData);
        }
        setError('')
      })
      .catch((err) => {
        console.log(err.message);
        setError(err)
      });
    setMsg("");
  };

  const onSendMessage = async (event: any) => {
    if (event.key === "Enter") {
      callApi();
    }
  };

  const onMsgchange = (event: any) => {
    setMsg(event.target.value);
  };

  const onRegenerate = () => {
    const n = data.length;
    data.push({ ...data[n - 1], id: n + 1 });
    const newBigData = bigContentData.filter((eachEntry: any) => {
      if (eachEntry.id === chatDataId) {
        return { ...eachEntry, entry: data };
      }
      return eachEntry;
    });
    localStorage.setItem("bigContentData", JSON.stringify(newBigData));
    setData(data);
    setBigContentData(newBigData);
    setRefresh(!refresh);
  };

  const onNewChat = () => {
    const newEntry = {
      id: uuidv4(),
      entry: [],
    };
    bigContentData.push(newEntry);

    setBigContentData(bigContentData);
    setChatDataId(newEntry.id);
    setData([]);
    localStorage.setItem("bigContentData", JSON.stringify(bigContentData));
    //setRefresh(!refresh)
  };

  const onChatClick = (event: any) => {
    const chatId = event.target.id;
    const requiredData = bigContentData.filter(
      (eachEntry) => eachEntry.id === chatId
    );
    setData(requiredData[0].entry);
    setChatDataId(chatId);
  };

  const onDeleteChat = (event: any) => {
    const chatId = event.currentTarget.parentNode.id;
    const updatedData = bigContentData.filter((eachEntry)=>eachEntry.id!==chatId)
    setBigContentData(updatedData);
    localStorage.setItem("bigContentData", JSON.stringify(updatedData));
  }

  const onClearChat = ()=>{
    localStorage.removeItem("bigContentData")
    setBigContentData([])
    setData([])
  }
  return (
    <div
      style={{
        width: "70%",
        height: "600px",
        backgroundColor: "#fff",
        display: "flex",
      }}
    >
      <div
        style={{
          backgroundColor: "#212023",
          width: "20%",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          style={{
            backgroundColor: "transparent",
            border: "1px solid #80808080",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "12px",
            color: "white",
            width: "100%",
          }}
          onClick={onNewChat}
        >
          New Chat
        </button>
        <hr style={{border:"1px solid #80808080",margin:"16px 0px"}}/>
        <ul
         style={{ listStyleType: "none",height:"78%",overflowY:"auto",paddingBottom:"8px"}}
         >
          {bigContentData &&
            bigContentData.map((eachEntry) => (
              <li
                style={{
                  backgroundColor: "#3a3c4dcb",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "white",
                  padding: "8px",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={onChatClick}
                id={eachEntry.id}
                key={eachEntry.id}
              >
                {eachEntry?.entry[0]!==undefined && `${eachEntry.entry[0].msg.slice(0, 10)} ...`}
                <MdDelete
                  values={eachEntry.id}
                  style={{
                    fontSize: "20px",
                    color: "white",
                  }}
                  onClick={onDeleteChat}
                />
              </li>
            ))}
        </ul>
        <hr style={{border:"1px solid #80808080",margin:"16px 0px"}}/>
        <button
          style={{
            backgroundColor: "transparent",
            border: "1px solid #80808080",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "12px",
            color: "white",
            width: "100%",
            alignSelf:"flex-end"
          }}
          onClick={onClearChat}
        >
          Clear Chat
        </button>
      </div>
      <div
        style={{
          position: "relative",
          width: "80%",
          display: "flex",
          flexDirection: "column",
          padding: "16px 0px",
          backgroundColor: "#8b8b8e1a",
        }}
      >
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            fontSize: "24px",
            fontWeight: "bold",
            width: "50px",
            marginLeft: "auto",
          }}
          onClick={onClosechatGpt}
        >
          X
        </button>
        {error && <p style={{color:"red"}}>{error}</p>}
        <ul
          style={{
            height: "100%",
            listStyleType: "none",
            marginTop: "8px",
            overflowY: "auto",
          }}
        >
          {data &&
            data.map((eachItem, index) => (
              <li
                key={index}
                style={{
                  fontSize: "12px",
                  fontFamily: "roboto",
                  color: "#5f6368",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderTop: "1px solid #80808049",
                    borderBottom: "1px solid #80808049",
                    padding: "12px 72px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p>
                    <AiOutlineUser
                      style={{ marginRight: "16px", fontSize: "20px" }}
                    />
                  </p>
                  <p>{eachItem.question}</p>
                </div>
                <div
                  style={{
                    padding: "12px 72px",
                    display: "flex",
                    paddingBottom: "72px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={chatgptImg}
                    style={{ marginRight: "16px", height: "20px" }}
                    alt="chatgpt"
                  />
                  <p>{eachItem.msg}</p>
                </div>
              </li>
            ))}
        </ul>
        <div
          style={{
            position: "absolute",
            width: "90%",
            top: "81%",
            left: "3%",
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              fontSize: "12px",
              color: "#5f6368",
              width: "180px",
              margin: "auto",
              marginBottom: "8px",
              padding: "12px 24px",
              border: "1px solid #80808049",
              backgroundColor: "white",
              borderRadius: "4px",
            }}
            onClick={onRegenerate}
          >
            Regenerate Response
          </button>
          <input
            style={{
              paddingLeft: "16px",
              boxShadow: "0 0 15px 0 #0000001a",
              border: "1px solid #0000001a",
              width: "95%",
              height: "42px",
              borderRadius: "8px",
              color: "#5f6368",
            }}
            placeholder="Send a message"
            onKeyDown={onSendMessage}
            onChange={onMsgchange}
            value={msg}
          />
        </div>
      </div>
    </div>
  );
};
export default Chatgpt;
