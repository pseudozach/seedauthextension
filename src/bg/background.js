// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

console.log("background.js running");
var myInterval;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log("got lnurl in bg.js: ", request.lnurl);
  	sendResponse({status: "ok"});

  	myInterval = setInterval(flipicon,500);
  	
    checklnurl(request.lnurl);

});

function parselnurl(str) {
  try {
    return str.toLowerCase().match(/lnurl\w+/)[0]
  } catch (e) {}
}

function checklnurl(lnurl) {
  try {
    url = new URL(
      buffer.Buffer.from(
        bech32.fromWords(bech32.decode(parselnurl(lnurl), 1500).words)
      ).toString()
    )
    if (url.searchParams.get('tag') !== 'login') {
      // toast.error(
      //   `lnurl <em>${url}</em> doesn't specify the <em>login</em> tag.`
      // )
      // replace('/')
      console.log("lnurl doesnt specify the login tag");
    } else {
      console.log("login tag found, trying to login: ", url);
      generateKeyAndSign (url);

    }
    // username = localStorage.getItem(`username:${url.host}`)
  } catch (err) {
    // toast.error(`Invalid lnurl <em>${params.lnurl}</em>: ${err}`)
    console.log("invalid lnurl: ", lnurl, err);
    // replace('/')
  }
}


 // let params = {}
 //  params.lnurl = "lnurl1dp68gurn8ghj7ctsdyhxcmndv9exket5wvhxxmmd9akxuatjdshkz0m5v9nn6mr0va5kufntxy7nzvphxvcnvvryv4sk2dpsxf3rgve3xycngdp5xucngetx8qekvcnyvejnqc3kxqux2dmpvgerzcfkxp3rzetyxa3njvrrvgmk2cfevgnxsmtpvv7nqeph8qekxdtxvejk2dec8qukgdnzx93k2cfsxejkxwr9v5cnzdeev5enzd3evf3ryden8yerqcejxv6njvfe893rwwpevd3k2cecxgpdkdws";
  const ec = new elliptic.ec('secp256k1')


// onMount(() => {

// })

  var username
  var password
  var passwordType = 'password'
  var skey
  var pkey
  var pkey16 = ''
  var sig = ''

  // it's true if we generate a key that isn't equal
  // to the last successful one for this username
  var pkeyMismatch = false

  // it's true if we tried to make a request and failed
  // (happens on Firefox depending on who knows what)
  // the next request will be a simple form GET
  var brokenCORS = false

  function generateKeyAndSign (url) { 
  // debounce(() => {
    pkeyMismatch = false

    username = localStorage.getItem("username");
    password = localStorage.getItem("password");
    console.log("u, p: ", username, password);

    const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
    shaObj.update(url.host+":"+username+password);
    const hash = shaObj.getHash("HEX");

    // let hash = shajs('sha256').update(`${url.host}:${username}:${password}`)
  // const sk = ec.keyFromPrivate(hash.digest())

    const sk = ec.keyFromPrivate(hash)
    const pk = sk.getPublic()
    pkey16 = pk.encode('hex')
    let lastStoredSuccessKey = localStorage.getItem(
      `successpkey:${url.host}:${username}`
    )

    if (lastStoredSuccessKey && lastStoredSuccessKey !== pkey16) {
      pkeyMismatch = true
    }

    let msg = buffer.Buffer.from(url.searchParams.get('k1'), 'hex')
    sig = buffer.Buffer.from(ec.sign(msg, sk).toDER()).toString('hex')
    console.log("sig: ", sig, pkey16);

    console.log(`successpkey:${url.host}:${username}`);
    console.log("next step to actually login");

    handleSubmit(sig, pkey16)
  // }, 1000)
}

  async function handleSubmit(sig, pkey16) {
    // e.preventDefault()

    url.searchParams.set('sig', sig)
    url.searchParams.set('key', pkey16)
    url.searchParams.set('t', Date.now())

    try {
      let r = await window.fetch(url.toString())
      let t = await r.text()
      let resp = JSON.parse(t)
      if (resp.status !== 'OK') {
        // toast.warning(`Login failed: <em>${resp.reason}</em>`)
        console.log("Login failed: ", resp.reason);
      } else {
        // toast.success('Login success!')
        console.log("Login success!")
        localStorage.setItem(`successpkey:${url.host}:${username}`, pkey16)
        localStorage.setItem(`username:${url.host}`, username)
        addtosites(url.host)
        // if (window.opener) {
        //   window.opener.postMessage('success')
        //   window.close()
        // }
      }
    } catch (err) {
      if (err.message === 'NetworkError when attempting to fetch resource.') {
        brokenCORS = true
        return
      }
      console.log("Error calling: ", url, err);
      // toast.error(`Error calling <em>${url}</em>: ${err}`)
    }
  }


function addtosites(host){
  var loggedinsites = JSON.parse(localStorage.getItem("loggedinsites"));
  console.log("addtosites loggedinsites: ", loggedinsites);
  if(loggedinsites){
    loggedinsites[loggedinsites.length] = host;
    localStorage.setItem("loggedinsites", JSON.stringify(loggedinsites));
  } else {
    console.log("first site!");
    var loggedinsites = [];
    loggedinsites[0] = host;
    localStorage.setItem("loggedinsites", JSON.stringify(loggedinsites));   
  }
}




var flipcounter = 0;
function flipicon(){
	// console.log("flipicon tr icon: ", flipcounter);
	// setTimeout(function(){
		chrome.browserAction.setIcon({path: '../../icons/key64c.png'});
	// }, 1000);
	setTimeout(function(){
  		chrome.browserAction.setIcon({path: '../../icons/key64.png'});
  		// if(flipcounter < 3){
  		// 	flipicon();
  			flipcounter++;
  		// }
  		if(flipcounter > 2){
  			window.clearInterval(myInterval);
  		}
  	}, 250);
}

//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	// chrome.pageAction.show(sender.tab.id);
//     sendResponse({farewell: "goodbye2"});
//   });




