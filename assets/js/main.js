(async function(){
  const userForm = document.getElementById("userForm");
  const userInput = document.getElementById("userInput");

  const params = new URLSearchParams(window.location.search);
  if(params.has("user")&&params.get("user").length > 0){
    const userId = params.get("user");

    const data = await getHistory(userId);
    if(!data[0]) return alert("ユーザーの履歴が存在しません");

    userInput.value = userId;

    historyList(data);
  }

  userForm.addEventListener("submit",async(event)=>{
    event.preventDefault();

    document.querySelector(".historyList").innerHTML = "";

    const userId = userInput.value;

    const data = await getHistory(userId);
    if(!data[0]) return alert("ユーザーの履歴が存在しません");

    historyList(data);
  });
})();

async function getHistory(id){
  const data = await fetch(`https://api.takasumibot.com/v1/history?id=${id}`)
    .then(res=>res.json())
    .catch(error=>{
      console.log(error);
    });

  if(!data.data) return [];

  data.data.reverse();

  return data.data;
}

function historyList(data){
  document.querySelector(".historyList").insertAdjacentHTML("afterbegin",
    `<tr>
        <th scope="row">-</th>
        <td>-</td>
        <td>-</td>
        <td>合計${data.reduce((pre,his)=>pre+his.amount,0)}コイン</td>
    </tr>`
      +
    data.map(history=>{
      return `<tr>
        <th scope="row">${history.id}</th>
        <td>${history.amount}コイン</td>
        <td>${history.reason}</td>
        <td>${history.time}</td>
      </tr>`;
    }).join("")
  );
}