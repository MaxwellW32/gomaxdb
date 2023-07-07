const YoutubeDefault = [
    "https://www.youtube.com/watch?v=FFfdyV8gnWk&ab_channel=Deepspot",
    "https://www.youtube.com/watch?v=5dEtSIadXUM&ab_channel=BGMSTUDIO",
    "https://www.youtube.com/watch?v=D-ya6U-pbWo&ab_channel=SimonGro%C3%9F",
    "https://www.youtube.com/watch?v=GajYV70ePZo&ab_channel=StudyDaysRadio",
    "https://www.youtube.com/watch?v=SYM-RJwSGQ8",
    "https://www.youtube.com/watch?v=kWam-Hh2lxE&t=1115s&ab_channel=NUEKI",
    "https://www.youtube.com/watch?v=iEWsSRdDk90&ab_channel=PhonkMage",
    "https://www.youtube.com/watch?v=ZlzP3seRWk0&ab_channel=JasonStephenson-SleepMeditationMusic",
    "https://www.youtube.com/watch?v=l9LNIUNa7x4&ab_channel=Tatsumi",
    "https://www.youtube.com/watch?v=CQGSBm-yZms&ab_channel=Lo-FiZone",
    "https://www.youtube.com/watch?v=hinf6VI4VtU&ab_channel=SweetGirl",
    "https://www.youtube.com/watch?v=xV2O-xUyNH8&ab_channel=PamelaD.Wilburn",
    "https://www.youtube.com/watch?v=zi2arMU_VMM&ab_channel=VOIQ",
    "https://www.youtube.com/watch?v=zF5Ddo9JdpY&ab_channel=LeagueofLegends",
    "https://www.youtube.com/watch?v=aR-KAldshAE&ab_channel=LeagueofLegends",
    "https://www.youtube.com/watch?v=pNYF9XhMDXs&ab_channel=HyperTunes",
    "https://www.youtube.com/watch?v=yU0tnrEk8H4&ab_channel=Marshmello",
    "https://www.youtube.com/watch?v=D-pKeb6Wf4U",
    "https://www.youtube.com/watch?v=5E4ZBSInqUU",
    "https://www.youtube.com/watch?v=P9Ijqa_2eu0",
    "https://www.youtube.com/watch?v=ymq1WdGUcw8",
    "https://www.youtube.com/watch?v=fiusxyygqGk",
    "https://www.youtube.com/watch?v=bYiAspDYNgU",
    "https://www.youtube.com/watch?v=Lj-_mD0w474",
    "https://www.youtube.com/watch?v=X_IO_7OoAEA&ab_channel=dileqre",
    "https://www.youtube.com/watch?v=CAMWdvo71ls&pp=ygUOdG91cyBsZXMgbWVtZXM%3D",
    "https://www.youtube.com/watch?v=uAOR6ib95kQ&pp=ygUIZ29yaWxsYXo%3D",
    "https://www.youtube.com/watch?v=HyHNuVaZJ-k&ab_channel=Gorillaz",
    "https://www.youtube.com/watch?v=bvC_0foemLY&ab_channel=RobinSchulz",
    "https://www.youtube.com/watch?v=C-fexNlzMtQ&ab_channel=RoseateMusic",
    "https://www.youtube.com/watch?v=wnJ6LuUFpMo&ab_channel=jbalvinVEVO",
    "https://www.youtube.com/watch?v=RRl_C73vFtQ",
    "https://www.youtube.com/watch?v=iI34LYmJ1Fs",
    "https://www.youtube.com/watch?v=ApXoWvfEYVU",
    "https://www.youtube.com/watch?v=tcaw6lzYt1Q",
    "https://www.youtube.com/watch?v=LlU4FuIJT2k",
    "https://www.youtube.com/watch?v=5XK4v2fgMPU",
    "https://www.youtube.com/watch?v=KBtk5FUeJbk",
    "https://youtu.be/6ONRf7h3Mdk",
    "https://youtu.be/34Na4j8AVgA",
    "https://www.youtube.com/watch?v=r_0JjYUe5jo",
    "https://www.youtube.com/watch?v=1XzY2ij_vL4",
    "https://youtu.be/SC4xMk98Pdc",
    "https://youtu.be/cr82wSBZeeQ",
    "https://youtu.be/wXhTHyIgQ_U",
    "https://youtu.be/UZwi9SHgzGY",
    "https://youtu.be/E5ONTXHS2mM",
    "https://youtu.be/ZD6C498MB4U",
    "https://youtu.be/L7mfjvdnPno",
    "https://www.youtube.com/watch?v=8UVNT4wvIGY",
    "https://www.youtube.com/watch?v=0bOUOCo6NLQ",
    "https://www.youtube.com/watch?v=3H5rtwc3epE"
  ]

const YoutubeDefaultList = (array: any)=> {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
    

function testforDubplicates(YoutubeDefaultList: string[]){
  let foundDuplicates = false
    let count = 1

    YoutubeDefaultList.forEach(eachYtid => {
        count = 0; // Reset count for each new value

        YoutubeDefaultList.forEach(eachSeenYtidAgain => {
            if (eachYtid === eachSeenYtidAgain) {
                count++;

                if (count > 1) {
                    foundDuplicates = true;
                    console.log(`dup ${eachYtid}`);
                    console.log(`${count}`);
                }
            }
        });

    });
}
export default YoutubeDefaultList(YoutubeDefault)