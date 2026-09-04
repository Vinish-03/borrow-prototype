const seedItems=[
{id:1,name:"Casio FX-991ES",category:"Study",condition:"Excellent",price:10,mode:"Paid",location:"Block A",emoji:"🧮",owner:"Arjun",available:"Sep 5 - Sep 15",desc:"Scientific calculator, perfect for engineering exams and lab work."},
{id:2,name:"DBMS Textbook",category:"Books",condition:"Good",price:0,mode:"Free",location:"Library",emoji:"📚",owner:"Meera",available:"Sep 4 - Sep 20",desc:"Database Management Systems textbook. Free for students."},
{id:3,name:"HDMI Cable",category:"Electronics",condition:"Good",price:5,mode:"Paid",location:"Block C",emoji:"🔌",owner:"Rahul",available:"Sep 4 - Sep 12",desc:"2 meter HDMI cable for presentations and project demos."},
{id:4,name:"Tripod",category:"Project",condition:"Excellent",price:20,mode:"Paid",location:"Hostel A",emoji:"📷",owner:"Sneha",available:"Sep 6 - Sep 18",desc:"Lightweight tripod for project videos and photography."},
{id:5,name:"Lab Coat",category:"College",condition:"Good",price:0,mode:"Exchange",location:"Block B",emoji:"🥼",owner:"Kiran",available:"Sep 5 - Sep 10",desc:"Clean lab coat. Open to exchange for a textbook."},
{id:6,name:"Football",category:"Sports",condition:"Good",price:0,mode:"Free",location:"Sports Ground",emoji:"⚽",owner:"Vikram",available:"Sep 4 - Sep 8",desc:"Football available for campus games."}
];

let state={
  page:"home",
  items:JSON.parse(localStorage.getItem("bib_items")||"null")||seedItems,
  requests:JSON.parse(localStorage.getItem("bib_requests")||"[]"),
  category:"All", query:""
};
function save(){localStorage.setItem("bib_items",JSON.stringify(state.items));localStorage.setItem("bib_requests",JSON.stringify(state.requests))}
function initials(n){return n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function layout(content){
return `<div class="app"><header class="topbar"><div class="brand">Borrow <span>Instead of Buy</span></div><nav class="nav">
<button class="${state.page==='home'?'active':''}" onclick="go('home')">Home</button><button class="${state.page==='search'?'active':''}" onclick="go('search')">Search</button><button class="${state.page==='add'?'active':''}" onclick="go('add')">+ List Item</button><button class="${state.page==='requests'?'active':''}" onclick="go('requests')">Requests</button><button class="${state.page==='profile'?'active':''}" onclick="go('profile')">Profile</button></nav><div class="user-mini"><div class="avatar">V</div><span>Vinish</span></div></header><main class="main">${content}</main></div>`}
function go(p){state.page=p;render()}
function home(){
return `<section class="hero"><div><h1>Borrow what you need.<br>Don't buy what you don't.</h1><p>Save money, reduce waste, and share useful things with students around your campus.</p><button class="btn white" onclick="go('search')">Find an item →</button></div><div class="hero-art">🤝📦</div></section>
<section class="section"><div class="stats"><div class="stat"><span class="muted">Items available</span><b>${state.items.length}</b></div><div class="stat"><span class="muted">Money saved</span><b>₹4,250</b></div><div class="stat"><span class="muted">Your trust score</span><b>92/100</b></div><div class="stat"><span class="muted">Completed</span><b>12</b></div></div></section>
<section class="section"><div class="section-head"><h2>Popular nearby</h2><button class="btn ghost" onclick="go('search')">View all</button></div><div class="grid">${state.items.slice(0,3).map(itemCard).join("")}</div></section>
<section class="section"><div class="section-head"><h2>How it works</h2></div><div class="grid"><div class="card"><h3>1. 🔎 Find</h3><p class="muted">Search for an item available near you.</p></div><div class="card"><h3>2. 🤝 Borrow</h3><p class="muted">Choose dates and send a request to the owner.</p></div><div class="card"><h3>3. ⭐ Return</h3><p class="muted">Return on time and rate each other.</p></div></div></section>`}
function itemCard(i){return `<article class="card"><div class="item-img">${i.emoji}</div><div class="row"><h3>${i.name}</h3><span class="status">${i.mode}</span></div><p class="muted">${i.condition} · 📍 ${i.location}</p><div class="tags"><span class="tag">${i.category}</span><span class="tag">⭐ 4.8</span></div><div class="row"><span class="price">${i.price?`₹${i.price}/day`:"Free"}</span><button class="btn primary" onclick="details(${i.id})">View</button></div></article>`}
function search(){
let cats=["All","Study","Books","Electronics","Project","College","Sports"];
let filtered=state.items.filter(i=>(state.category==="All"||i.category===state.category)&&i.name.toLowerCase().includes(state.query.toLowerCase()));
return `<div class="section-head"><h1>Find something to borrow</h1><button class="btn primary" onclick="go('add')">+ List Item</button></div>
<div class="searchbar"><span>🔎</span><input value="${state.query}" oninput="state.query=this.value;render()" placeholder="Search calculators, books, cables..."></div>
<div class="filters">${cats.map(c=>`<button class="chip ${state.category===c?'active':''}" onclick="state.category='${c}';render()">${c}</button>`).join("")}</div>
<div class="grid">${filtered.length?filtered.map(itemCard).join(""):`<div class="empty" style="grid-column:1/-1">No items found. Try another search.</div>`}</div>`}
function details(id){
let i=state.items.find(x=>x.id===id);
document.body.insertAdjacentHTML("beforeend",`<div class="modal-bg" id="modal"><div class="modal"><div class="item-img">${i.emoji}</div><div class="row"><h2>${i.name}</h2><span class="status">${i.mode}</span></div><p class="muted">${i.desc}</p><p><b>Owner:</b> ${i.owner} · ⭐ 4.8</p><p><b>Location:</b> ${i.location}</p><p><b>Available:</b> ${i.available}</p><p class="price">${i.price?`₹${i.price}/day`:"Free to borrow"}</p><div class="field"><label>Borrow dates</label><input id="start" type="date"><input id="end" type="date" style="margin-top:7px"></div><div class="actions"><button class="btn primary" onclick="requestBorrow(${i.id})">Request to Borrow</button><button class="btn ghost" onclick="closeModal()">Cancel</button></div></div></div>`)}
function closeModal(){document.getElementById("modal")?.remove()}
function requestBorrow(id){
let s=document.getElementById("start").value,e=document.getElementById("end").value;
if(!s||!e){alert("Please select both dates.");return}
state.requests.push({id:Date.now(),itemId:id,borrower:"Vinish",start:s,end:e,status:"Pending"});save();closeModal();toast("Borrow request sent!");go("requests")}
function requests(){
if(!state.requests.length)return `<div class="section-head"><h1>Borrow requests</h1></div><div class="empty">No requests yet.<br><br><button class="btn primary" onclick="go('search')">Find something to borrow</button></div>`;
return `<div class="section-head"><h1>Borrow requests</h1></div><div class="list">${state.requests.map(r=>{let i=state.items.find(x=>x.id===r.itemId);return `<div class="request"><div class="row"><div><h3>${i?.name||"Item"}</h3><p class="muted">Requested by ${r.borrower} · ${r.start} → ${r.end}</p></div><span class="status ${r.status==='Rejected'?'rejected':r.status==='Pending'?'pending':''}">${r.status}</span></div><div class="actions">${r.status==='Pending'?`<button class="btn primary" onclick="approve(${r.id})">Accept</button><button class="btn danger" onclick="reject(${r.id})">Reject</button>`:""}<button class="btn ghost" onclick="go('search')">Browse items</button></div></div>`}).join("")}</div>`}
function approve(id){let r=state.requests.find(x=>x.id===id);r.status="Approved";save();toast("Request accepted.");render()}
function reject(id){let r=state.requests.find(x=>x.id===id);r.status="Rejected";save();toast("Request rejected.");render()}
function add(){
return `<div class="section-head"><h1>List an item</h1></div><form class="form" onsubmit="addItem(event)"><div class="field"><label>Item name *</label><input id="iname" required placeholder="e.g. Scientific Calculator"></div><div class="field"><label>Category</label><select id="icat"><option>Study</option><option>Books</option><option>Electronics</option><option>Project</option><option>College</option><option>Sports</option></select></div><div class="field"><label>Condition</label><select id="icond"><option>Excellent</option><option>Good</option><option>Fair</option></select></div><div class="field"><label>Borrowing type</label><select id="imode"><option>Free</option><option>Paid</option><option>Exchange</option></select></div><div class="field"><label>Price per day (₹)</label><input id="iprice" type="number" min="0" value="0"></div><div class="field"><label>Location</label><input id="iloc" required placeholder="e.g. Block A"></div><div class="field"><label>Available dates</label><input id="iavail" required placeholder="e.g. Sep 5 - Sep 15"></div><div class="field"><label>Description</label><textarea id="idesc" placeholder="Tell borrowers about the item..."></textarea></div><button class="btn primary">Publish item</button></form>`}
function addItem(e){e.preventDefault();state.items.unshift({id:Date.now(),name:iname.value,category:icat.value,condition:icond.value,mode:imode.value,price:Number(iprice.value),location:iloc.value,available:iavail.value,desc:idesc.value||"No description.",owner:"Vinish",emoji:icat.value==="Books"?"📚":icat.value==="Sports"?"⚽":icat.value==="Electronics"?"🔌":icat.value==="Study"?"🧮":"📦"});save();toast("Item listed successfully!");go("search")}
function profile(){
return `<div class="section-head"><h1>Your profile</h1></div><div class="profile"><div class="profile-box"><div class="big-avatar">V</div><h2>Vinish</h2><p class="muted">CSE · College Student</p><h2>92/100</h2><p class="muted">Trust Score</p><button class="btn ghost" onclick="toast('Profile editing coming soon')">Edit profile</button></div><div class="card"><h2>Your activity</h2><div class="stats"><div class="stat"><span class="muted">Listed</span><b>${state.items.filter(i=>i.owner==="Vinish").length}</b></div><div class="stat"><span class="muted">Borrowed</span><b>12</b></div><div class="stat"><span class="muted">Returns</span><b>12</b></div><div class="stat"><span class="muted">Rating</span><b>4.8 ⭐</b></div></div><div class="section"><h3>Trust score breakdown</h3><p>Successful returns <b>+50</b></p><p>On-time returns <b>+25</b></p><p>Good ratings <b>+17</b></p></div></div></div>`}
function toast(msg){let t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
function render(){let c=state.page==="home"?home():state.page==="search"?search():state.page==="add"?add():state.page==="requests"?requests():profile();document.getElementById("app").innerHTML=layout(c)}
render();