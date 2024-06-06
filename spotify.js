console.log('JS starts');

async function getsongs() {
   
        let response = await fetch('http://127.0.0.1:5500/songs/');
        
        // Check if the response is OK (status 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let text = await response.text();
        console.log('Fetched response:', text);

        let div = document.createElement("div");
        div.innerHTML = text;

        let as = div.getElementsByTagName("a");
        console.log('Links found:', as);

        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("/songs/")[1]);
            }
        }
        
        return songs;
    
}
async function main(){
    let songs = await getsongs();
    console.log(songs);

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML+ `<li>
                            <div class="songinfo">
                            
                            <div class="info">
                                <div>Song</div>
                                <div>${song.replaceAll("%20"," ")}</div>
                            </div>
                            </div>
                            <img src="play.svg" alt="">
                          </li>`;
    }

    //play first song
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata",() => {
        let duration = audio.duration;
        console.log(audio.duration,audio.currentSrc,audio.currentTime)
    })
}
main()
