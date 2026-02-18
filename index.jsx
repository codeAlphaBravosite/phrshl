import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const VERBS = [
  { id:1,  verb:"Call off",      meaning:"To cancel something",                                  example:"The match was called off due to rain.",                   cat:"CANCEL",     hint:"📵 Cancel = Call it OFF",                hot:true  },
  { id:2,  verb:"Call on",       meaning:"To visit or ask someone formally",                     example:"The teacher called on Priya to answer.",                  cat:"REQUEST",    hint:"📞 Calling ON someone's door",            hot:false },
  { id:3,  verb:"Call up",       meaning:"To phone / summon for duty",                           example:"He was called up to serve in the army.",                  cat:"SUMMON",     hint:"☎️ Calling UP to headquarters",           hot:false },
  { id:4,  verb:"Give up",       meaning:"To stop trying; quit",                                 example:"Never give up on your dreams.",                           cat:"ABANDON",    hint:"🏳️ Handing your effort AWAY",             hot:true  },
  { id:5,  verb:"Give in",       meaning:"To surrender to pressure",                             example:"After arguing, he finally gave in.",                       cat:"YIELD",      hint:"🤲 Caving IN under pressure",             hot:true  },
  { id:6,  verb:"Give away",     meaning:"To reveal a secret / donate freely",                  example:"Her smile gave away the surprise.",                       cat:"REVEAL",     hint:"🎁 Letting it escape AWAY",               hot:true  },
  { id:7,  verb:"Give out",      meaning:"To distribute / stop functioning",                    example:"The teacher gave out papers. His legs gave out.",         cat:"DISTRIBUTE", hint:"📤 Spreading OUT or running OUT",         hot:false },
  { id:8,  verb:"Look up",       meaning:"To search for information / to improve",              example:"Look up the meaning in the dictionary.",                  cat:"SEARCH",     hint:"🔍 Looking UP in a dictionary",           hot:true  },
  { id:9,  verb:"Look into",     meaning:"To investigate / examine carefully",                  example:"Police are looking into the matter.",                     cat:"INVESTIGATE",hint:"🔎 Peering deep INTO a problem",          hot:true  },
  { id:10, verb:"Look after",    meaning:"To take care of someone",                             example:"She looks after her younger siblings.",                   cat:"CARE",       hint:"👀 Watching AFTER someone",               hot:true  },
  { id:11, verb:"Look forward to",meaning:"To anticipate with excitement",                      example:"I look forward to meeting you.",                          cat:"ANTICIPATE", hint:"⏩ Excitement pulling you FORWARD",        hot:true  },
  { id:12, verb:"Look down on",  meaning:"To consider inferior; disrespect",                    example:"Don't look down on others.",                             cat:"DISRESPECT", hint:"👆 Looking DOWN from a height",           hot:false },
  { id:13, verb:"Make up",       meaning:"To invent / reconcile / apply cosmetics",             example:"She made up an excuse.",                                 cat:"INVENT",     hint:"🎭 Creating something from nothing",       hot:true  },
  { id:14, verb:"Make out",      meaning:"To understand / claim / manage",                      example:"I couldn't make out what he said.",                       cat:"UNDERSTAND", hint:"🧩 Extracting meaning OUT",               hot:true  },
  { id:15, verb:"Make for",      meaning:"To move towards / contribute to",                     example:"Politeness makes for a good impression.",                cat:"CONTRIBUTE", hint:"➡️ Heading in a direction FOR",           hot:false },
  { id:16, verb:"Put off",       meaning:"To postpone / to discourage",                         example:"Don't put off what you can do today.",                   cat:"POSTPONE",   hint:"⏰ Pushing away into the future",         hot:true  },
  { id:17, verb:"Put up with",   meaning:"To tolerate or endure",                               example:"I can't put up with this noise.",                         cat:"TOLERATE",   hint:"🏋️ Holding UP despite burden",            hot:true  },
  { id:18, verb:"Put forward",   meaning:"To propose or suggest",                               example:"She put forward a brilliant plan.",                       cat:"PROPOSE",    hint:"💡 Pushing idea to the FRONT",            hot:true  },
  { id:19, verb:"Put down",      meaning:"To criticize / humiliate / write down",               example:"He always puts her down in public.",                      cat:"CRITICIZE",  hint:"⬇️ Pressing someone DOWNWARD",            hot:false },
  { id:20, verb:"Take up",       meaning:"To begin a hobby / occupy space",                     example:"She took up painting last year.",                         cat:"BEGIN",      hint:"🎨 Picking UP a new activity",            hot:true  },
  { id:21, verb:"Take off",      meaning:"To leave ground / remove / become successful",        example:"The plane took off at noon.",                             cat:"DEPART",     hint:"✈️ Lifting OFF the ground",               hot:true  },
  { id:22, verb:"Take after",    meaning:"To resemble a parent or relative",                    example:"She takes after her mother.",                             cat:"RESEMBLE",   hint:"👨‍👧 Following AFTER family traits",          hot:true  },
  { id:23, verb:"Take over",     meaning:"To gain control of something",                        example:"The new CEO took over the company.",                      cat:"CONTROL",    hint:"🏛️ Moving OVER to control",               hot:true  },
  { id:24, verb:"Take in",       meaning:"To deceive / absorb / provide shelter",               example:"We were taken in by his lies.",                           cat:"DECEIVE",    hint:"🪤 Pulling something IN (deception)",     hot:false },
  { id:25, verb:"Run into",      meaning:"To meet by chance / encounter a problem",             example:"I ran into my old friend at the market.",                 cat:"ENCOUNTER",  hint:"💥 Crashing INTO someone unexpectedly",   hot:true  },
  { id:26, verb:"Run out of",    meaning:"To exhaust the supply of something",                  example:"We ran out of time in the exam.",                         cat:"EXHAUST",    hint:"📉 Supply running AWAY",                  hot:true  },
  { id:27, verb:"Run over",      meaning:"To hit with a vehicle / review quickly",              example:"Let's run over the key points.",                          cat:"REVIEW",     hint:"🚗 Going OVER something quickly",         hot:false },
  { id:28, verb:"Break down",    meaning:"To stop functioning / lose control / analyze",        example:"My car broke down on the highway.",                       cat:"FAIL",       hint:"💥 Collapsing DOWNWARD",                  hot:true  },
  { id:29, verb:"Break out",     meaning:"To escape / begin suddenly (war, fire)",              example:"A fire broke out in the factory.",                        cat:"ESCAPE",     hint:"🔥 Bursting OUT suddenly",                hot:true  },
  { id:30, verb:"Break through", meaning:"To overcome a barrier / achieve an advance",          example:"Scientists broke through in cancer research.",            cat:"OVERCOME",   hint:"🧱 Smashing THROUGH a wall",              hot:false },
  { id:31, verb:"Break up",      meaning:"To end a relationship / disperse",                    example:"They broke up after three years.",                        cat:"SEPARATE",   hint:"💔 Splitting into pieces",                hot:false },
  { id:32, verb:"Carry out",     meaning:"To perform or complete a task",                       example:"The soldiers carried out their orders.",                  cat:"EXECUTE",    hint:"✅ Carrying a task to completion",         hot:true  },
  { id:33, verb:"Carry on",      meaning:"To continue despite difficulties",                    example:"Carry on with your work.",                               cat:"CONTINUE",   hint:"🚂 Moving ON persistently",               hot:true  },
  { id:34, verb:"Come across",   meaning:"To find unexpectedly / make an impression",           example:"She comes across as very confident.",                     cat:"ENCOUNTER",  hint:"🛤️ Crossing paths unexpectedly",          hot:true  },
  { id:35, verb:"Come up with",  meaning:"To think of an idea or solution",                     example:"He came up with an innovative solution.",                 cat:"IDEATE",     hint:"💡 Idea rising UP to the surface",        hot:true  },
  { id:36, verb:"Come round",    meaning:"To regain consciousness / change opinion",            example:"She came round after the operation.",                     cat:"RECOVER",    hint:"🔄 Returning to awareness in a circle",   hot:true  },
  { id:37, verb:"Set up",        meaning:"To establish or arrange something",                   example:"She set up her own business at 25.",                      cat:"ESTABLISH",  hint:"🏗️ Placing things UP into structure",      hot:true  },
  { id:38, verb:"Set off",       meaning:"To begin a journey / trigger / explode",              example:"They set off early in the morning.",                      cat:"DEPART",     hint:"🚀 Launching OFF from a point",           hot:true  },
  { id:39, verb:"Set back",      meaning:"To delay progress / cost money",                      example:"The accident set the project back by weeks.",             cat:"DELAY",      hint:"⏪ Pushing progress BACKWARD",             hot:false },
  { id:40, verb:"Turn up",       meaning:"To arrive / appear unexpectedly / increase volume",   example:"He turned up an hour late.",                             cat:"APPEAR",     hint:"🌅 Something appearing from nowhere",     hot:false },
  { id:41, verb:"Turn down",     meaning:"To refuse / reduce (volume or heat)",                 example:"She turned down the job offer.",                          cat:"REFUSE",     hint:"❌ Pressing DOWN in rejection",            hot:true  },
  { id:42, verb:"Turn out",      meaning:"To result in / produce / attend",                     example:"The event turned out to be a success.",                   cat:"RESULT",     hint:"🎯 Final outcome emerging OUT",           hot:true  },
  { id:43, verb:"Bring about",   meaning:"To cause something to happen",                        example:"Technology brought about major changes.",                 cat:"CAUSE",      hint:"⚙️ Bringing a result into existence",     hot:true  },
  { id:44, verb:"Bring up",      meaning:"To raise a child / mention a topic",                  example:"She was brought up by her grandparents.",                 cat:"RAISE",      hint:"📢 Raising UP (child or topic)",          hot:true  },
  { id:45, verb:"Fall out",      meaning:"To quarrel / lose hair / fall from",                  example:"She fell out with her best friend.",                      cat:"QUARREL",    hint:"💔 Friendship falling OUT",               hot:true  },
  { id:46, verb:"Fall back on",  meaning:"To use as a last resort",                             example:"She fell back on her savings during the crisis.",         cat:"RESORT",     hint:"🛡️ Retreating to a backup",               hot:false },
  { id:47, verb:"Fall through",  meaning:"To fail to happen; collapse",                         example:"Our holiday plans fell through.",                         cat:"FAIL",       hint:"🕳️ Plans crumbling THROUGH the floor",    hot:true  },
  { id:48, verb:"Go through",    meaning:"To experience / examine / be approved",               example:"She went through a tough phase.",                         cat:"EXPERIENCE", hint:"🌊 Passing THROUGH an experience",        hot:true  },
  { id:49, verb:"Go off",        meaning:"To explode / ring (alarm) / go bad",                  example:"The alarm went off at 6 AM.",                            cat:"EXPLODE",    hint:"💥 Bursting OFF suddenly",                hot:true  },
  { id:50, verb:"Stand for",     meaning:"To represent / to tolerate",                          example:"UN stands for United Nations.",                           cat:"REPRESENT",  hint:"🏛️ Standing IN PLACE of something",       hot:true  },
  { id:51, verb:"Stand out",     meaning:"To be noticeable or exceptional",                     example:"Her dress made her stand out.",                           cat:"NOTABLE",    hint:"⭐ Rising ABOVE everything else",          hot:true  },
  { id:52, verb:"Stand up for",  meaning:"To defend or support someone",                        example:"Always stand up for what is right.",                      cat:"DEFEND",     hint:"🛡️ Rising to DEFEND",                     hot:false },
  { id:53, verb:"Get over",      meaning:"To recover from / overcome",                          example:"It took months to get over the loss.",                    cat:"RECOVER",    hint:"🏔️ Climbing OVER a wall of difficulty",   hot:true  },
  { id:54, verb:"Get away with", meaning:"To escape punishment for wrongdoing",                 example:"He got away with cheating in the exam.",                  cat:"ESCAPE",     hint:"🏃 Escaping WITH the crime",              hot:true  },
  { id:55, verb:"Get rid of",    meaning:"To eliminate or dispose of",                          example:"It's hard to get rid of bad habits.",                     cat:"ELIMINATE",  hint:"🗑️ Freeing yourself FROM a burden",        hot:false },
  { id:56, verb:"Get through",   meaning:"To succeed despite difficulties / contact",           example:"We somehow got through the crisis.",                      cat:"SURVIVE",    hint:"🚪 Pushing THROUGH a barrier",            hot:true  },
  { id:57, verb:"Keep up with",  meaning:"To stay at the same level / stay informed",           example:"It's hard to keep up with the news.",                     cat:"MAINTAIN",   hint:"🏃 Running to stay ALONGSIDE someone",    hot:false },
  { id:58, verb:"Keep on",       meaning:"To continue doing persistently",                      example:"Keep on trying until you succeed.",                       cat:"CONTINUE",   hint:"⚙️ Engine that doesn't stop",             hot:false },
  { id:59, verb:"Keep back",     meaning:"To withhold / restrain",                              example:"She kept back information from the police.",              cat:"WITHHOLD",   hint:"🚧 Holding from moving FORWARD",          hot:false },
  { id:60, verb:"Cut off",       meaning:"To stop supply / disconnect / interrupt",             example:"The government cut off electricity.",                     cat:"DISCONNECT", hint:"✂️ Severing a connection",                hot:true  },
  { id:61, verb:"Cut down on",   meaning:"To reduce the amount of something",                   example:"Cut down on sugar for better health.",                    cat:"REDUCE",     hint:"📉 Hacking DOWN the quantity",             hot:false },
  { id:62, verb:"Point out",     meaning:"To indicate or bring attention to something",         example:"She pointed out the errors in the report.",               cat:"INDICATE",   hint:"☝️ Finger pointing at something",         hot:false },
  { id:63, verb:"Work out",      meaning:"To exercise / find a solution / result in",           example:"Everything worked out in the end.",                       cat:"SOLVE",      hint:"🏋️ Working until done",                   hot:true  },
  { id:64, verb:"Figure out",    meaning:"To understand or solve after thought",                example:"Can you figure out this puzzle?",                         cat:"UNDERSTAND", hint:"🧠 Mental calculation → answer",          hot:true  },
  { id:65, verb:"Pick up",       meaning:"To learn informally / collect / improve",             example:"She picked up Spanish in 6 months.",                      cat:"LEARN",      hint:"🎒 Grabbing knowledge along the way",     hot:true  },
  { id:66, verb:"Pick out",      meaning:"To choose or identify from a group",                  example:"Can you pick out the correct answer?",                   cat:"SELECT",     hint:"🎯 Pulling ONE thing OUT of many",         hot:false },
  { id:67, verb:"Fill in",       meaning:"To complete a form / substitute for someone",         example:"Please fill in the application form.",                    cat:"COMPLETE",   hint:"📝 Filling empty spaces",                 hot:false },
  { id:68, verb:"Pass out",      meaning:"To lose consciousness / distribute",                  example:"She passed out in the heat.",                             cat:"FAINT",      hint:"😵 Consciousness passing AWAY",           hot:false },
  { id:69, verb:"Pass off",      meaning:"To falsely present / happen smoothly",                example:"He passed off fake goods as genuine.",                    cat:"DECEIVE",    hint:"🎭 Disguising something as another",       hot:true  },
  { id:70, verb:"Show up",       meaning:"To appear or arrive / expose someone",                example:"He didn't show up for the meeting.",                      cat:"APPEAR",     hint:"🎬 Presence rising UP",                   hot:false },
  { id:71, verb:"Show off",      meaning:"To display proudly to impress others",                example:"He always shows off his phone.",                          cat:"BOAST",      hint:"🦚 Performing OUT for applause",           hot:false },
  { id:72, verb:"Let down",      meaning:"To disappoint someone",                               example:"Don't let down the people who trust you.",                cat:"DISAPPOINT", hint:"😔 Dropping from a height of trust",      hot:true  },
  { id:73, verb:"Let off",       meaning:"To excuse from punishment / fire a weapon",           example:"The teacher let him off with a warning.",                 cat:"EXCUSE",     hint:"🔓 Releasing the trigger of punishment",  hot:false },
  { id:74, verb:"Pull off",      meaning:"To succeed in something difficult",                   example:"She pulled off a brilliant performance.",                 cat:"ACHIEVE",    hint:"🏆 Yanking victory from difficulty",       hot:true  },
  { id:75, verb:"Pull through",  meaning:"To survive a dangerous situation",                    example:"The patient pulled through the surgery.",                 cat:"SURVIVE",    hint:"🚑 Pulled to safety THROUGH danger",      hot:false },
  { id:76, verb:"Account for",   meaning:"To explain / constitute a portion",                   example:"Vegetables account for 30% of her diet.",                cat:"EXPLAIN",    hint:"🧾 Giving account of something",          hot:true  },
  { id:77, verb:"Build up",      meaning:"To increase gradually / develop",                     example:"Exercise builds up your strength.",                       cat:"DEVELOP",    hint:"🧱 Constructing layer by layer",           hot:false },
  { id:78, verb:"Count on",      meaning:"To rely or depend on",                                example:"You can always count on your family.",                    cat:"RELY",       hint:"⚖️ Placing your weight ON it",             hot:false },
  { id:79, verb:"Deal with",     meaning:"To handle or manage a situation",                     example:"She knows how to deal with pressure.",                    cat:"HANDLE",     hint:"🃏 Playing the cards you're dealt",        hot:true  },
  { id:80, verb:"Die out",       meaning:"To become extinct / disappear gradually",             example:"Many species are dying out.",                             cat:"EXTINCT",    hint:"🦕 Fading AWAY into nothingness",         hot:false },
  { id:81, verb:"Drop out",      meaning:"To leave school before completing",                   example:"He dropped out of college to start a company.",           cat:"QUIT",       hint:"⬇️ Falling OUT of a system",               hot:false },
  { id:82, verb:"End up",        meaning:"To reach a final situation unexpectedly",             example:"He ended up as a chef.",                                  cat:"RESULT",     hint:"🎲 Arriving at unplanned destination",    hot:true  },
  { id:83, verb:"Find out",      meaning:"To discover information",                             example:"She found out about the surprise party.",                 cat:"DISCOVER",   hint:"🔍 Locating hidden information",          hot:true  },
  { id:84, verb:"Hang on",       meaning:"To wait / hold tightly",                              example:"Hang on, I'll be right back.",                            cat:"WAIT",       hint:"🪝 Gripping while suspended",             hot:false },
  { id:85, verb:"Live up to",    meaning:"To meet expectations or standards",                   example:"She lived up to everyone's expectations.",               cat:"MEET",       hint:"📏 Rising to the level set for you",      hot:true  },
  { id:86, verb:"Mix up",        meaning:"To confuse one thing with another",                   example:"I always mix up their names.",                            cat:"CONFUSE",    hint:"🌀 Ingredients getting confused together", hot:true  },
  { id:87, verb:"Own up",        meaning:"To confess or admit to something",                    example:"Own up to your mistakes.",                               cat:"CONFESS",    hint:"🙋 Taking OWNERSHIP of a wrong",          hot:false },
  { id:88, verb:"Pay off",       meaning:"To yield results / bribe / repay debt",              example:"All the hard work paid off.",                             cat:"SUCCEED",    hint:"💰 Investment finally returning profit",   hot:true  },
  { id:89, verb:"Rule out",      meaning:"To eliminate as a possibility",                       example:"The doctors ruled out cancer.",                           cat:"ELIMINATE",  hint:"❌ Drawing a line THROUGH an option",      hot:true  },
  { id:90, verb:"Sort out",      meaning:"To organize / resolve a problem",                     example:"Let me sort out this misunderstanding.",                  cat:"RESOLVE",    hint:"📂 Arranging chaos into order",           hot:true  },
  { id:91, verb:"Step up",       meaning:"To increase / take more responsibility",              example:"She stepped up when no one else would.",                  cat:"RISE",       hint:"🪜 Climbing to a higher duty",             hot:false },
  { id:92, verb:"Sum up",        meaning:"To summarize the main points",                        example:"Can you sum up the chapter in 5 points?",                cat:"SUMMARIZE",  hint:"➕ Adding all points into one total",       hot:false },
  { id:93, verb:"Think over",    meaning:"To consider carefully before deciding",               example:"Think it over before you respond.",                       cat:"CONSIDER",   hint:"🔄 Turning an idea OVER in your mind",    hot:false },
  { id:94, verb:"Wear out",      meaning:"To exhaust / become damaged through use",             example:"The long journey wore them out.",                         cat:"EXHAUST",    hint:"👟 Shoes worn to nothing",                hot:false },
  { id:95, verb:"Wind up",       meaning:"To end up in a situation / conclude / tease",         example:"He wound up in jail for fraud.",                          cat:"RESULT",     hint:"⏱️ Clock wound down to its end",           hot:false },
  { id:96, verb:"Hold back",     meaning:"To restrain / prevent / hesitate",                    example:"Don't hold back—give it your all!",                       cat:"RESTRAIN",   hint:"🦮 Leash pulling from moving FORWARD",    hot:true  },
  { id:97, verb:"Hold off",      meaning:"To delay / keep at a distance",                       example:"Hold off on the announcement.",                           cat:"DELAY",      hint:"🤚 Keeping at arm's length",              hot:false },
  { id:98, verb:"Phase out",     meaning:"To gradually discontinue something",                  example:"The company is phasing out plastic packaging.",           cat:"DISCONTINUE",hint:"📉 Slowly fading in phases",               hot:false },
  { id:99, verb:"Mark off",      meaning:"To check items on a list / separate by marking",     example:"Mark off the items as you pack them.",                   cat:"CHECK",      hint:"✔️ Ticking boxes with a marker",           hot:false },
  { id:100,verb:"Face up to",    meaning:"To accept and deal with something difficult",         example:"She finally faced up to her fears.",                      cat:"ACCEPT",     hint:"🧱 Turning to FACE the problem",          hot:true  },
];

const FILL_BLANKS = [
  { sentence:"The cricket match was ________ due to heavy rain.",            verb:"called off",    meaning:"cancelled" },
  { sentence:"Don't ________ your dreams no matter how hard life gets.",     verb:"give up",       meaning:"stop trying" },
  { sentence:"The fire ________ in the kitchen last night.",                 verb:"broke out",     meaning:"started suddenly" },
  { sentence:"She ________ a brilliant solution to the problem.",            verb:"came up with",  meaning:"thought of" },
  { sentence:"Police are ________ the matter of corruption.",                verb:"looking into",  meaning:"investigating" },
  { sentence:"The plane ________ 30 minutes behind schedule.",               verb:"took off",      meaning:"departed" },
  { sentence:"Years of hard work finally ________.",                         verb:"paid off",      meaning:"yielded results" },
  { sentence:"Her smile ________ the surprise party.",                       verb:"gave away",     meaning:"revealed" },
  { sentence:"He ________ his grandfather in looks and nature.",             verb:"takes after",   meaning:"resembles" },
  { sentence:"I can't ________ this noise any longer.",                      verb:"put up with",   meaning:"tolerate" },
  { sentence:"Technology has ________ major changes in communication.",      verb:"brought about", meaning:"caused" },
  { sentence:"She was ________ by her aunt after her parents passed away.",  verb:"brought up",    meaning:"raised" },
  { sentence:"The team managed to ________ an incredible comeback.",         verb:"pull off",      meaning:"achieve something difficult" },
  { sentence:"He tried to ________ fake goods as genuine products.",         verb:"pass off",      meaning:"falsely present" },
  { sentence:"Can you ________ what he is saying? His accent is thick.",     verb:"make out",      meaning:"understand" },
];

const CAT_COLOR = {
  CANCEL:"#ef4444",REQUEST:"#f97316",SUMMON:"#eab308",ABANDON:"#ef4444",YIELD:"#f97316",
  REVEAL:"#22c55e",DISTRIBUTE:"#3b82f6",SEARCH:"#8b5cf6",INVESTIGATE:"#8b5cf6",CARE:"#ec4899",
  ANTICIPATE:"#10b981",DISRESPECT:"#ef4444",INVENT:"#f59e0b",UNDERSTAND:"#3b82f6",CONTRIBUTE:"#22c55e",
  POSTPONE:"#f97316",TOLERATE:"#8b5cf6",PROPOSE:"#10b981",CRITICIZE:"#ef4444",BEGIN:"#22c55e",
  DEPART:"#eab308",RESEMBLE:"#ec4899",CONTROL:"#3b82f6",DECEIVE:"#ef4444",ENCOUNTER:"#f97316",
  EXHAUST:"#ef4444",REVIEW:"#22c55e",FAIL:"#ef4444",ESCAPE:"#f97316",OVERCOME:"#10b981",
  SEPARATE:"#8b5cf6",EXECUTE:"#3b82f6",CONTINUE:"#10b981",IDEATE:"#f59e0b",RECOVER:"#22c55e",
  ESTABLISH:"#10b981",DELAY:"#f97316",APPEAR:"#eab308",REFUSE:"#ef4444",RESULT:"#22c55e",
  CAUSE:"#f59e0b",RAISE:"#3b82f6",QUARREL:"#ef4444",RESORT:"#8b5cf6",EXPERIENCE:"#3b82f6",
  EXPLODE:"#ef4444",REPRESENT:"#10b981",NOTABLE:"#eab308",DEFEND:"#22c55e",SURVIVE:"#10b981",
  EXPLAIN:"#8b5cf6",DEVELOP:"#3b82f6",RELY:"#ec4899",HANDLE:"#f59e0b",EXTINCT:"#8b5cf6",
  QUIT:"#ef4444",CONFUSE:"#f97316",CONFESS:"#22c55e",SUCCEED:"#10b981",ELIMINATE:"#ef4444",
  RESOLVE:"#22c55e",RISE:"#3b82f6",SUMMARIZE:"#8b5cf6",CONSIDER:"#f59e0b",MEET:"#10b981",
  MAINTAIN:"#3b82f6",WITHHOLD:"#f97316",DISCONNECT:"#ef4444",REDUCE:"#f97316",INDICATE:"#3b82f6",
  SOLVE:"#10b981",LEARN:"#f59e0b",SELECT:"#8b5cf6",COMPLETE:"#22c55e",FAINT:"#f97316",
  BOAST:"#eab308",DISAPPOINT:"#ef4444",EXCUSE:"#f97316",ACHIEVE:"#10b981",WAIT:"#3b82f6",
  RESTRAIN:"#f97316",DISCONTINUE:"#8b5cf6",CHECK:"#22c55e",ACCEPT:"#10b981",DISCOVER:"#f59e0b",
};

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function getWrong(verb) {
  return shuffle(VERBS.filter(v => v.id !== verb.id)).slice(0, 3).map(v => v.meaning);
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0d1117;--s1:#161b22;--s2:#1c2333;--s3:#21262d;
  --border:#30363d;--text:#e6edf3;--muted:#7d8590;
  --amber:#f0a500;--amber2:#fbbf24;
  --green:#3fb950;--red:#f85149;--blue:#58a6ff;--hot:#ff6b35;
}
html{-webkit-text-size-adjust:100%;touch-action:manipulation;}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100dvh;overscroll-behavior:none;-webkit-font-smoothing:antialiased;}
.app{max-width:680px;margin:0 auto;padding-bottom:70px;}
.topbar{position:sticky;top:0;z-index:100;background:rgba(13,17,23,0.96);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:10px 16px;display:flex;align-items:center;gap:10px;}
.logo{font-family:'Playfair Display',serif;font-size:17px;font-weight:900;color:var(--amber);flex:1;}
.logo span{color:var(--text);}
.prog-pill{font-size:11px;font-weight:600;background:var(--s2);border:1px solid var(--border);border-radius:20px;padding:4px 10px;white-space:nowrap;color:var(--muted);}
.prog-pill b{color:var(--green);}
.bottomnav{position:fixed;bottom:0;left:0;right:0;z-index:100;background:rgba(13,17,23,0.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid var(--border);display:flex;padding:0 0 env(safe-area-inset-bottom,0);}
.bnav{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:8px 2px 10px;cursor:pointer;border:none;background:none;color:var(--muted);font-size:9px;font-family:'DM Sans',sans-serif;font-weight:700;letter-spacing:0.3px;-webkit-tap-highlight-color:transparent;transition:color 0.15s;}
.bnav-ico{font-size:20px;line-height:1;}
.bnav.active{color:var(--amber);}
.page{padding:14px 14px 8px;}
.card{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:16px;}
/* HOME */
.masthead{background:var(--s1);border:1px solid var(--border);border-radius:20px;padding:22px 18px 20px;margin-bottom:12px;text-align:center;position:relative;overflow:hidden;}
.masthead::after{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:300px;height:160px;background:radial-gradient(ellipse,rgba(240,165,0,0.1) 0%,transparent 70%);pointer-events:none;}
.mast-tag{font-size:10px;font-weight:700;letter-spacing:2px;color:var(--amber);margin-bottom:6px;text-transform:uppercase;}
.mast-h1{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;line-height:1.2;margin-bottom:6px;}
.mast-sub{font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.5;}
.stat-row{display:flex;justify-content:center;gap:0;}
.stat-item{flex:1;text-align:center;padding:0 6px;}
.stat-item:not(:last-child){border-right:1px solid var(--border);}
.stat-num{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;display:block;line-height:1;}
.stat-lbl{font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;}
.pb-wrap{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:12px 14px;margin-bottom:12px;}
.pb-row{display:flex;justify-content:space-between;margin-bottom:7px;font-size:12px;font-weight:600;}
.pb-track{height:7px;background:var(--s3);border-radius:4px;overflow:hidden;}
.pb-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--amber),var(--green));transition:width 0.5s;}
.modes-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.mode-tile{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:14px 12px;cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:left;}
.mode-tile:active{opacity:0.8;}
.mode-tile.wide{grid-column:1/-1;}
.tile-icon{font-size:24px;margin-bottom:8px;display:block;line-height:1;}
.tile-name{font-size:14px;font-weight:700;margin-bottom:2px;}
.tile-desc{font-size:11px;color:var(--muted);line-height:1.45;}
.tile-badge{display:inline-block;font-size:9px;font-weight:700;background:rgba(255,107,53,0.12);color:var(--hot);border:1px solid rgba(255,107,53,0.28);border-radius:10px;padding:2px 7px;margin-bottom:6px;}
/* FILTER CHIPS */
.chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;margin-bottom:12px;scrollbar-width:none;}
.chips::-webkit-scrollbar{display:none;}
.chip{flex-shrink:0;border:1px solid var(--border);background:var(--s1);color:var(--muted);border-radius:20px;padding:5px 11px;font-size:11px;font-weight:600;cursor:pointer;-webkit-tap-highlight-color:transparent;white-space:nowrap;transition:all 0.12s;}
.chip.on{border-color:var(--amber);color:var(--amber);background:rgba(240,165,0,0.07);}
.chip.hot-chip{border-color:rgba(255,107,53,0.35);color:#ff9d7d;}
.chip.hot-chip.on{color:var(--hot);background:rgba(255,107,53,0.09);}
/* FLASHCARD */
.fc-counter{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.fc-counter-txt{font-size:12px;font-weight:600;color:var(--muted);}
.fc-status{font-size:11px;font-weight:700;border-radius:20px;padding:3px 10px;}
.fcs-mastered{background:rgba(63,185,80,0.1);color:var(--green);border:1px solid rgba(63,185,80,0.25);}
.fcs-learning{background:rgba(240,165,0,0.08);color:var(--amber);border:1px solid rgba(240,165,0,0.22);}
.fcs-new{background:var(--s2);color:var(--muted);border:1px solid var(--border);}
/* The card itself */
.fc-scene{perspective:900px;margin-bottom:10px;}
.fc{width:100%;min-height:300px;position:relative;transform-style:preserve-3d;transition:transform 0.48s cubic-bezier(0.4,0,0.2,1);cursor:pointer;-webkit-tap-highlight-color:transparent;border-radius:20px;}
.fc.flipped{transform:rotateY(180deg);}
.fc-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:20px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:300px;}
.fc-front{background:var(--s1);border:1px solid var(--border);}
.fc-back{background:linear-gradient(160deg,#151f2e 0%,#192038 100%);border:1px solid rgba(240,165,0,0.18);transform:rotateY(180deg);}
.hot-badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;background:rgba(255,107,53,0.1);color:var(--hot);border:1px solid rgba(255,107,53,0.28);border-radius:20px;padding:3px 9px;margin-bottom:10px;}
.cat-tag{font-size:9px;font-weight:700;letter-spacing:1.5px;border-radius:20px;padding:3px 9px;margin-bottom:12px;display:inline-block;text-transform:uppercase;}
.fc-verb{font-family:'Playfair Display',serif;font-size:34px;font-weight:900;line-height:1.1;margin-bottom:10px;}
.fc-hint{font-size:13px;color:var(--muted);line-height:1.5;max-width:260px;}
.fc-tap{font-size:10px;color:var(--border);font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-top:14px;}
.fc-meaning{font-size:19px;font-weight:700;color:var(--amber);margin-bottom:12px;line-height:1.35;}
.fc-example{font-size:13px;color:var(--muted);line-height:1.6;font-style:italic;max-width:270px;}
.fc-example em{color:var(--text);font-style:normal;font-weight:600;}
.fc-swipe{text-align:center;font-size:11px;color:var(--border);margin-bottom:8px;font-weight:600;}
/* FC action buttons */
.fc-btns{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:7px;}
.fcb{border:1px solid var(--border);border-radius:12px;padding:11px 4px;font-size:11px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--s1);color:var(--muted);}
.fcb:active{opacity:0.7;}
.fcb .bi{font-size:17px;}
.fcb-learn{background:rgba(240,165,0,0.06);color:var(--amber);border-color:rgba(240,165,0,0.22);}
.fcb-master{background:rgba(63,185,80,0.06);color:var(--green);border-color:rgba(63,185,80,0.2);}
/* QUIZ */
.q-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.q-score{font-size:13px;color:var(--muted);font-weight:600;}
.q-score b{font-family:'Playfair Display',serif;font-size:22px;color:var(--amber);}
.streak{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;background:rgba(240,165,0,0.07);border:1px solid rgba(240,165,0,0.18);border-radius:20px;padding:4px 11px;color:var(--amber2);}
.q-card{background:var(--s1);border:1px solid var(--border);border-radius:18px;padding:20px 16px;margin-bottom:12px;position:relative;overflow:hidden;}
.q-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--amber),var(--green));}
.q-hot{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;background:rgba(255,107,53,0.09);color:var(--hot);border:1px solid rgba(255,107,53,0.25);border-radius:20px;padding:2px 8px;margin-bottom:8px;}
.q-lbl{font-size:10px;font-weight:700;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;}
.q-verb{font-family:'Playfair Display',serif;font-size:28px;font-weight:900;margin-bottom:6px;line-height:1.2;}
.q-eg{font-size:13px;color:var(--muted);font-style:italic;line-height:1.5;}
.opts{display:grid;grid-template-columns:1fr;gap:7px;margin-bottom:12px;}
@media(min-width:430px){.opts{grid-template-columns:1fr 1fr;}}
.opt{background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:12px;padding:13px 14px;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent;transition:border-color 0.12s;}
.opt-locked{pointer-events:none;}
.opt-correct{border-color:var(--green)!important;background:rgba(63,185,80,0.07)!important;color:var(--green)!important;}
.opt-wrong{border-color:var(--red)!important;background:rgba(248,81,73,0.06)!important;color:var(--red)!important;}
.feedback{border-radius:12px;padding:11px 14px;font-size:13px;font-weight:600;margin-bottom:11px;display:flex;align-items:center;gap:7px;}
.fb-ok{background:rgba(63,185,80,0.07);color:var(--green);border:1px solid rgba(63,185,80,0.22);}
.fb-bad{background:rgba(248,81,73,0.06);color:var(--red);border:1px solid rgba(248,81,73,0.18);}
.next-btn{width:100%;background:var(--amber);color:#0d1117;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;}
.next-btn:active{opacity:0.85;}
/* FILL */
.fill-hdr{display:flex;justify-content:space-between;margin-bottom:12px;font-size:12px;font-weight:600;}
.fill-card{background:var(--s1);border:1px solid var(--border);border-radius:18px;padding:20px 16px;margin-bottom:12px;position:relative;overflow:hidden;}
.fill-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#8b5cf6,#3b82f6);}
.fill-sentence{font-size:17px;font-weight:600;line-height:1.65;margin-bottom:6px;}
.fill-blank{display:inline-block;border-bottom:2px solid var(--amber);padding:0 4px;min-width:90px;text-align:center;color:var(--amber);font-weight:800;}
.fill-hint{font-size:12px;color:var(--muted);margin-bottom:14px;font-style:italic;}
.fill-input{width:100%;background:var(--s2);border:2px solid var(--border);border-radius:12px;padding:12px 14px;font-size:16px;font-family:'DM Sans',sans-serif;font-weight:600;color:var(--text);outline:none;-webkit-appearance:none;appearance:none;margin-bottom:9px;}
.fill-input:focus{border-color:var(--amber);}
.fi-ok{border-color:var(--green)!important;}
.fi-bad{border-color:var(--red)!important;}
.ans-box{background:var(--s2);border:1px solid rgba(240,165,0,0.18);border-radius:10px;padding:11px 14px;margin-bottom:10px;}
.ans-lbl{font-size:9px;font-weight:700;color:var(--muted);letter-spacing:1.5px;margin-bottom:3px;}
.ans-val{font-size:17px;font-weight:700;color:var(--amber);}
.check-btn{width:100%;background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:12px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;color:var(--text);cursor:pointer;}
.check-btn:active{opacity:0.75;}
/* RAPID */
.rapid-page{text-align:center;padding:14px;}
.timer-wrap{position:relative;width:86px;height:86px;margin:0 auto 10px;}
.timer-svg{transform:rotate(-90deg);}
.timer-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:26px;font-weight:900;}
.t-urgent{color:var(--red);animation:blink 0.5s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.35}}
.r-score{font-family:'Playfair Display',serif;font-size:50px;font-weight:900;color:var(--amber);line-height:1;}
.r-lbl{font-size:10px;color:var(--muted);font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:18px;}
.r-verb{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;line-height:1.2;margin-bottom:4px;}
.r-q{font-size:13px;color:var(--muted);margin-bottom:16px;}
.r-opts{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.ropt{background:var(--s1);border:1px solid var(--border);border-radius:13px;padding:13px 8px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;color:var(--text);cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:center;line-height:1.4;}
.ropt:active:not(.rl){opacity:0.7;}
.rl{pointer-events:none;}
.r-correct{border-color:var(--green)!important;background:rgba(63,185,80,0.09)!important;color:var(--green)!important;}
.r-wrong{border-color:var(--red)!important;background:rgba(248,81,73,0.06)!important;color:var(--red)!important;}
.r-end{padding:30px 14px;text-align:center;}
.re-big{font-family:'Playfair Display',serif;font-size:72px;font-weight:900;color:var(--amber);display:block;line-height:1;}
.re-grade{font-size:15px;color:var(--muted);margin:4px 0 20px;}
/* MATCH */
.match-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.match-pts{font-family:'Playfair Display',serif;font-size:28px;font-weight:900;color:var(--amber);}
.match-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.mc{background:var(--s1);border:1.5px solid var(--border);border-radius:13px;padding:13px 10px;cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:center;font-size:12px;font-weight:600;min-height:65px;display:flex;align-items:center;justify-content:center;line-height:1.4;transition:border-color 0.12s,background 0.12s;}
.mc-v{color:var(--amber);}
.mc-sel{border-color:var(--amber);background:rgba(240,165,0,0.06);}
.mc-done{border-color:var(--green);background:rgba(63,185,80,0.06);color:var(--green);pointer-events:none;}
.mc-err{border-color:var(--red);background:rgba(248,81,73,0.05);animation:shake 0.3s;}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
/* GLOSSARY */
.g-item{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:13px 14px;margin-bottom:7px;}
.g-hdr{display:flex;align-items:center;gap:7px;margin-bottom:5px;flex-wrap:wrap;}
.g-verb{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;}
.g-hot{display:inline-flex;align-items:center;gap:3px;font-size:9px;font-weight:700;background:rgba(255,107,53,0.1);color:var(--hot);border:1px solid rgba(255,107,53,0.28);border-radius:10px;padding:1px 6px;}
.g-cat{font-size:9px;font-weight:700;border-radius:10px;padding:2px 7px;text-transform:uppercase;letter-spacing:0.5px;}
.g-st{margin-left:auto;font-size:15px;}
.g-meaning{font-size:13px;color:var(--amber);font-weight:600;margin-bottom:2px;}
.g-eg{font-size:12px;color:var(--muted);font-style:italic;line-height:1.45;}
.g-hint{font-size:11px;color:var(--muted);margin-top:3px;opacity:0.7;}
.search-wrap{position:relative;margin-bottom:11px;}
.search-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:15px;height:15px;color:var(--muted);pointer-events:none;}
.search-in{width:100%;background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:10px 14px 10px 36px;font-size:15px;font-family:'DM Sans',sans-serif;color:var(--text);outline:none;-webkit-appearance:none;}
.search-in:focus{border-color:var(--amber);}
.search-in::placeholder{color:var(--muted);}
.empty{text-align:center;padding:40px 20px;color:var(--muted);font-size:14px;}
.btn-a{background:var(--amber);color:#0d1117;border:none;border-radius:12px;padding:13px 28px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;}
.btn-a:active{opacity:0.85;}
`;

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar({ n, total }) {
  const pct = Math.round((n / total) * 100);
  return (
    <div className="topbar">
      <div className="logo">CUET <span>Phrasal Verbs</span></div>
      <div className="prog-pill"><b>{pct}%</b> mastered</div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
const NAV = [
  { id:"home",     ico:"🏠", label:"Home"   },
  { id:"flash",    ico:"🃏", label:"Cards"  },
  { id:"quiz",     ico:"🎯", label:"Quiz"   },
  { id:"rapid",    ico:"⚡", label:"Rapid"  },
  { id:"glossary", ico:"📖", label:"List"   },
];
function BottomNav({ tab, setTab }) {
  return (
    <nav className="bottomnav">
      {NAV.map(n => (
        <button key={n.id} className={`bnav ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
          <span className="bnav-ico">{n.ico}</span>
          {n.label}
        </button>
      ))}
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ mastered, learning, setTab }) {
  const pct = Math.round((mastered.size / VERBS.length) * 100);
  const newN = VERBS.length - mastered.size - learning.size;
  return (
    <div className="page">
      <div className="masthead">
        <div className="mast-tag">🎯 CUET UG English Prep</div>
        <h1 className="mast-h1">Zero Mistakes on<br/>Phrasal Verbs.</h1>
        <p className="mast-sub">100 verbs. 5 modes. Every pattern NTA has ever tested — mastered.</p>
        <div className="stat-row">
          <div className="stat-item"><span className="stat-num" style={{color:"var(--amber)"}}>{VERBS.length}</span><span className="stat-lbl">Total</span></div>
          <div className="stat-item"><span className="stat-num" style={{color:"var(--green)"}}>{mastered.size}</span><span className="stat-lbl">Mastered</span></div>
          <div className="stat-item"><span className="stat-num" style={{color:"var(--amber2)"}}>{learning.size}</span><span className="stat-lbl">Reviewing</span></div>
          <div className="stat-item"><span className="stat-num" style={{color:"var(--muted)"}}>{newN}</span><span className="stat-lbl">Unseen</span></div>
        </div>
      </div>
      <div className="pb-wrap">
        <div className="pb-row"><span style={{color:"var(--muted)"}}>Mastery Progress</span><span style={{color:"var(--green)",fontWeight:700}}>{pct}%</span></div>
        <div className="pb-track"><div className="pb-fill" style={{width:`${pct}%`}} /></div>
      </div>
      <div className="modes-grid">
        <div className="mode-tile wide" onClick={() => setTab("flash")}>
          <span className="tile-icon">🃏</span>
          <div className="tile-name">Flashcards — Start Here</div>
          <div className="tile-desc">Flip cards with memory hooks. Swipe or tap. Mark mastered vs reviewing. Filter by category or HOT verbs.</div>
        </div>
        <div className="mode-tile" onClick={() => setTab("quiz")}>
          <span className="tile-icon">🎯</span>
          <div className="tile-name">MCQ Quiz</div>
          <div className="tile-desc">CUET-style 4-option questions. Streak tracker included.</div>
        </div>
        <div className="mode-tile" onClick={() => setTab("fill")}>
          <span className="tile-icon">✍️</span>
          <div className="tile-name">Fill the Blank</div>
          <div className="tile-desc">Type the verb in exam-style sentences.</div>
        </div>
        <div className="mode-tile" onClick={() => setTab("rapid")}>
          <div className="tile-badge">🔥 INTENSE</div>
          <span className="tile-icon">⚡</span>
          <div className="tile-name">Rapid Fire</div>
          <div className="tile-desc">45 seconds. As many as you can.</div>
        </div>
        <div className="mode-tile" onClick={() => setTab("match")}>
          <span className="tile-icon">🔗</span>
          <div className="tile-name">Match Pairs</div>
          <div className="tile-desc">Verb ↔ meaning. Fast recognition.</div>
        </div>
      </div>
    </div>
  );
}

// ─── FLASHCARDS ───────────────────────────────────────────────────────────────
function FlashPage({ mastered, learning, toggleMastered, toggleLearning }) {
  const [catFilter, setCatFilter] = useState("ALL");
  const [stFilter, setStFilter] = useState("all");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const startX = useRef(null);
  const CATS = useMemo(() => ["ALL", "HOT", ...new Set(VERBS.map(v => v.cat))], []);

  const pool = useMemo(() => {
    let v = VERBS;
    if (catFilter === "HOT") v = v.filter(x => x.hot);
    else if (catFilter !== "ALL") v = v.filter(x => x.cat === catFilter);
    if (stFilter === "mastered") v = v.filter(x => mastered.has(x.id));
    else if (stFilter === "learning") v = v.filter(x => learning.has(x.id));
    else if (stFilter === "new") v = v.filter(x => !mastered.has(x.id) && !learning.has(x.id));
    return v;
  }, [catFilter, stFilter, mastered, learning]);

  const si = pool.length > 0 ? idx % pool.length : 0;
  const verb = pool[si] || VERBS[0];
  const cc = CAT_COLOR[verb.cat] || "#3b82f6";

  const go = useCallback((d) => {
    setFlipped(false);
    setTimeout(() => setIdx(i => ((d > 0 ? i + 1 : i - 1 + pool.length)) % pool.length), 60);
  }, [pool.length]);

  const onTS = (e) => { startX.current = e.touches[0].clientX; };
  const onTE = (e) => {
    if (!startX.current) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  if (pool.length === 0) return (
    <div className="page"><div className="empty">No cards match this filter.</div></div>
  );

  const isMastered = mastered.has(verb.id);
  const isLearning = learning.has(verb.id);
  const stClass = isMastered ? "fcs-mastered" : isLearning ? "fcs-learning" : "fcs-new";
  const stLabel = isMastered ? "✅ Mastered" : isLearning ? "📚 Reviewing" : "🆕 New";

  const exParts = verb.example.split(new RegExp(`(${verb.verb})`, "i"));

  return (
    <div className="page">
      <div className="chips">
        {CATS.map(c => (
          <button key={c}
            className={`chip${catFilter === c ? " on" : ""}${c === "HOT" ? " hot-chip" : ""}`}
            onClick={() => { setCatFilter(c); setIdx(0); setFlipped(false); }}>
            {c === "HOT" ? "🔥 Hot" : c}
          </button>
        ))}
      </div>
      <div className="chips">
        {[["all","All"],["new","New"],["learning","Reviewing"],["mastered","Mastered"]].map(([v,l]) => (
          <button key={v} className={`chip${stFilter === v ? " on" : ""}`}
            onClick={() => { setStFilter(v); setIdx(0); setFlipped(false); }}>{l}</button>
        ))}
      </div>
      <div className="fc-counter">
        <span className="fc-counter-txt">{si + 1} / {pool.length}</span>
        <span className={`fc-status ${stClass}`}>{stLabel}</span>
      </div>
      <div className="fc-scene" onTouchStart={onTS} onTouchEnd={onTE}>
        <div className={`fc ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(f => !f)}>
          <div className="fc-face fc-front">
            {verb.hot && <div className="hot-badge">🔥 High Exam Probability</div>}
            <div className="cat-tag" style={{background:`${cc}18`,color:cc,border:`1px solid ${cc}28`}}>{verb.cat}</div>
            <div className="fc-verb">{verb.verb}</div>
            <div className="fc-hint">{verb.hint}</div>
            <div className="fc-tap">TAP TO FLIP</div>
          </div>
          <div className="fc-face fc-back">
            {verb.hot && <div className="hot-badge">🔥 High Exam Probability</div>}
            <div className="cat-tag" style={{background:`${cc}18`,color:cc,border:`1px solid ${cc}28`}}>{verb.cat}</div>
            <div className="fc-verb" style={{fontSize:22,color:"var(--amber)",marginBottom:8}}>{verb.verb}</div>
            <div className="fc-meaning">{verb.meaning}</div>
            <div className="fc-example">
              {exParts.map((p, i) =>
                p.toLowerCase() === verb.verb.toLowerCase() ? <em key={i}>{p}</em> : <span key={i}>{p}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fc-swipe">← swipe to navigate →</div>
      <div className="fc-btns">
        <button className="fcb" onClick={() => go(-1)}><span className="bi">◀</span>Prev</button>
        <button className={`fcb fcb-learn`} onClick={() => { toggleLearning(verb.id); go(1); }}>
          <span className="bi">📚</span>{isLearning ? "Saved" : "Review"}
        </button>
        <button className={`fcb fcb-master`} onClick={() => { toggleMastered(verb.id); go(1); }}>
          <span className="bi">✅</span>{isMastered ? "Done" : "Master"}
        </button>
        <button className="fcb" onClick={() => go(1)}><span className="bi">▶</span>Next</button>
      </div>
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
function QuizPage() {
  const [pool] = useState(() => shuffle(VERBS));
  const [qi, setQi] = useState(0);
  const [opts, setOpts] = useState([]);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const verb = pool[qi % pool.length];

  useEffect(() => {
    setOpts(shuffle([verb.meaning, ...getWrong(verb)]));
    setSel(null);
  }, [qi]);

  const pick = (opt) => {
    if (sel) return;
    setSel(opt);
    setTotal(t => t + 1);
    if (opt === verb.meaning) {
      setScore(s => s + 1);
      setStreak(s => { const ns = s + 1; if (ns > best) setBest(ns); return ns; });
    } else setStreak(0);
  };

  return (
    <div className="page">
      <div className="q-hdr">
        <div className="q-score"><b>{score}</b> / {total}</div>
        <div className="streak">🔥 {streak} <span style={{color:"var(--muted)",fontWeight:500,marginLeft:3}}>best {best}</span></div>
      </div>
      <div className="q-card">
        {verb.hot && <div className="q-hot">🔥 High Exam Probability</div>}
        <div className="q-lbl">What does this mean?</div>
        <div className="q-verb">{verb.verb}</div>
        <div className="q-eg">"{verb.example}"</div>
      </div>
      <div className="opts">
        {opts.map(opt => {
          let cls = "opt";
          if (sel) {
            cls += " opt-locked";
            if (opt === verb.meaning) cls += " opt-correct";
            else if (opt === sel) cls += " opt-wrong";
          }
          return <button key={opt} className={cls} onClick={() => pick(opt)}>{opt}</button>;
        })}
      </div>
      {sel && (
        <>
          <div className={`feedback ${sel === verb.meaning ? "fb-ok" : "fb-bad"}`}>
            {sel === verb.meaning ? "✓ Correct!" : `✗ Answer: "${verb.meaning}"`}
          </div>
          <button className="next-btn" onClick={() => setQi(i => i + 1)}>Next →</button>
        </>
      )}
    </div>
  );
}

// ─── FILL IN BLANK ────────────────────────────────────────────────────────────
function FillPage() {
  const [pool] = useState(() => shuffle(FILL_BLANKS));
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);

  const item = pool[qi % pool.length];

  const check = () => {
    if (!ans.trim()) return;
    setChecked(true);
    const u = ans.trim().toLowerCase();
    const c = item.verb.toLowerCase();
    if (u === c || c.includes(u) || u === c) setScore(s => s + 1);
  };

  const next = () => {
    setQi(i => i + 1);
    setAns("");
    setChecked(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const correct = checked && ans.trim().toLowerCase() === item.verb.toLowerCase();
  const parts = item.sentence.split("________");

  return (
    <div className="page">
      <div className="fill-hdr">
        <span style={{color:"var(--muted)"}}>Q {(qi % pool.length) + 1}/{pool.length}</span>
        <span style={{color:"var(--green)"}}>Score: {score}</span>
      </div>
      <div className="fill-card">
        <div className="fill-sentence">
          {parts[0]}<span className="fill-blank">{checked ? item.verb : "___?"}</span>{parts[1]}
        </div>
        <div className="fill-hint">💡 {item.meaning}</div>
        {!checked ? (
          <>
            <input
              ref={inputRef}
              className="fill-input"
              placeholder="Type the phrasal verb…"
              value={ans}
              onChange={e => setAns(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") check(); }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              inputMode="text"
            />
            <button className="check-btn" onClick={check} disabled={!ans.trim()}>Check ↵</button>
          </>
        ) : (
          <>
            <div className="ans-box"><div className="ans-lbl">CORRECT ANSWER</div><div className="ans-val">{item.verb}</div></div>
            <div className={`feedback ${correct ? "fb-ok" : "fb-bad"}`}>
              {correct ? "✓ Correct!" : `✗ "${item.verb}"`}
            </div>
            <button className="next-btn" onClick={next}>Next →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── RAPID FIRE ───────────────────────────────────────────────────────────────
function RapidPage() {
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(45);
  const [score, setScore] = useState(0);
  const [qi, setQi] = useState(0);
  const [opts, setOpts] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState(null);
  const timerRef = useRef(null);
  const poolRef = useRef([]);

  const buildOpts = (v) => shuffle([v.meaning, ...getWrong(v)]);

  const start = () => {
    poolRef.current = shuffle(VERBS);
    const v = poolRef.current[0];
    setTime(45); setScore(0); setQi(0);
    setOpts(buildOpts(v));
    setAnswered(false); setChosen(null);
    setActive(true);
  };

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) { clearInterval(timerRef.current); setActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const v = poolRef.current[qi % poolRef.current.length];
    setOpts(buildOpts(v));
    setAnswered(false); setChosen(null);
  }, [qi, active]);

  const pick = (opt) => {
    if (answered) return;
    const v = poolRef.current[qi % poolRef.current.length];
    setAnswered(true); setChosen(opt);
    if (opt === v.meaning) setScore(s => s + 1);
    setTimeout(() => setQi(i => i + 1), 480);
  };

  const R = 36, C = 2 * Math.PI * R;
  const dash = C * (1 - time / 45);
  const urgent = time <= 10;

  if (!active && time === 45) return (
    <div className="rapid-page">
      <div style={{padding:"50px 0 30px"}}>
        <div style={{fontSize:60,marginBottom:14}}>⚡</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:900,marginBottom:8}}>Rapid Fire</div>
        <div style={{color:"var(--muted)",fontSize:13,marginBottom:28,lineHeight:1.6}}>45 seconds. Answer as many<br/>phrasal verbs as you can.</div>
        <button className="btn-a" onClick={start} style={{padding:"14px 36px",fontSize:15}}>Start ⚡</button>
      </div>
    </div>
  );

  if (!active) {
    const grade = score >= 30 ? "🏆 CUET Topper!" : score >= 20 ? "🥇 Excellent!" : score >= 12 ? "📚 Good work!" : "💪 Keep going!";
    return (
      <div className="rapid-page r-end">
        <span className="re-big">{score}</span>
        <div className="re-grade">{grade}</div>
        <div style={{color:"var(--muted)",fontSize:13,marginBottom:24}}>phrasal verbs answered correctly</div>
        <button className="btn-a" onClick={start}>Try Again ⚡</button>
      </div>
    );
  }

  const verb = poolRef.current[qi % poolRef.current.length];
  return (
    <div className="rapid-page">
      <div className="timer-wrap">
        <svg className="timer-svg" width="86" height="86" viewBox="0 0 86 86">
          <circle cx="43" cy="43" r={R} fill="none" stroke="var(--s2)" strokeWidth="7"/>
          <circle cx="43" cy="43" r={R} fill="none"
            stroke={urgent ? "var(--red)" : "var(--amber)"}
            strokeWidth="7" strokeDasharray={C} strokeDashoffset={dash}
            strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear,stroke 0.3s"}}/>
        </svg>
        <div className={`timer-num ${urgent ? "t-urgent" : ""}`}>{time}</div>
      </div>
      <div className="r-score">{score}</div>
      <div className="r-lbl">correct</div>
      {verb.hot && <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><span className="hot-badge">🔥 High Exam Probability</span></div>}
      <div className="r-verb">{verb.verb}</div>
      <div className="r-q">What does this phrasal verb mean?</div>
      <div className="r-opts">
        {opts.map(opt => {
          let cls = "ropt";
          if (answered) {
            cls += " rl";
            if (opt === verb.meaning) cls += " r-correct";
            else if (opt === chosen) cls += " r-wrong";
          }
          return <button key={opt} className={cls} onClick={() => pick(opt)}>{opt}</button>;
        })}
      </div>
    </div>
  );
}

// ─── MATCH PAIRS ──────────────────────────────────────────────────────────────
function MatchPage() {
  const [cards, setCards] = useState([]);
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(new Set());
  const [wrong, setWrong] = useState(null);
  const [pts, setPts] = useState(0);
  const [round, setRound] = useState(1);

  const setup = () => {
    const s = shuffle(VERBS).slice(0, 6);
    setCards(shuffle([
      ...s.map((v,i) => ({ id:`v${i}`, text:v.verb, pid:v.id, type:"verb" })),
      ...s.map((v,i) => ({ id:`m${i}`, text:v.meaning, pid:v.id, type:"meaning" })),
    ]));
    setSel(null); setDone(new Set()); setWrong(null);
  };

  useEffect(() => { setup(); }, [round]);

  const tap = (c) => {
    if (done.has(c.pid) || wrong) return;
    if (!sel) { setSel(c); return; }
    if (sel.id === c.id) { setSel(null); return; }
    if (sel.pid === c.pid && sel.type !== c.type) {
      const nd = new Set([...done, c.pid]);
      setDone(nd); setSel(null); setPts(p => p + 10);
      if (nd.size === 6) setTimeout(() => setRound(r => r + 1), 900);
    } else {
      setWrong(c.id);
      setTimeout(() => { setWrong(null); setSel(null); }, 550);
    }
  };

  return (
    <div className="page">
      <div className="match-hdr">
        <span style={{fontSize:12,color:"var(--muted)",fontWeight:600}}>Verb ↔ Meaning · {done.size}/6</span>
        <span className="match-pts">{pts}</span>
        <button onClick={() => setRound(r => r + 1)} style={{border:"1px solid var(--border)",background:"var(--s1)",color:"var(--text)",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>🔀 New</button>
      </div>
      <div className="match-grid">
        {cards.map(c => {
          let cls = "mc";
          if (c.type === "verb") cls += " mc-v";
          if (sel?.id === c.id) cls += " mc-sel";
          if (done.has(c.pid)) cls += " mc-done";
          if (wrong === c.id) cls += " mc-err";
          return <div key={c.id} className={cls} onClick={() => tap(c)}>{done.has(c.pid) ? `✓ ${c.text}` : c.text}</div>;
        })}
      </div>
      {done.size === 6 && <div style={{textAlign:"center",marginTop:16,fontSize:16,fontWeight:700,color:"var(--green)"}}>🎉 Round complete!</div>}
    </div>
  );
}

// ─── GLOSSARY ─────────────────────────────────────────────────────────────────
function GlossaryPage({ mastered, learning }) {
  const [search, setSearch] = useState("");
  const [hotOnly, setHotOnly] = useState(false);

  const list = useMemo(() => {
    let v = hotOnly ? VERBS.filter(x => x.hot) : VERBS;
    if (search.trim()) {
      const q = search.toLowerCase();
      v = v.filter(x => x.verb.toLowerCase().includes(q) || x.meaning.toLowerCase().includes(q) || x.example.toLowerCase().includes(q));
    }
    return v;
  }, [search, hotOnly]);

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,flex:1}}>All Verbs</div>
        <span style={{fontSize:11,fontWeight:600,background:"var(--s2)",border:"1px solid var(--border)",borderRadius:20,padding:"3px 9px",color:"var(--muted)"}}>{list.length}</span>
      </div>
      <div className="search-wrap">
        <svg className="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input className="search-in" placeholder="Search verbs or meanings…" value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false"/>
      </div>
      <div className="chips" style={{marginBottom:12}}>
        <button className={`chip${!hotOnly?" on":""}`} onClick={() => setHotOnly(false)}>All 100</button>
        <button className={`chip hot-chip${hotOnly?" on":""}`} onClick={() => setHotOnly(h => !h)}>🔥 Hot Only ({VERBS.filter(v=>v.hot).length})</button>
      </div>
      {list.map(v => {
        const cc = CAT_COLOR[v.cat] || "#3b82f6";
        return (
          <div key={v.id} className="g-item">
            <div className="g-hdr">
              <span className="g-verb">{v.verb}</span>
              {v.hot && <span className="g-hot">🔥 EXAM</span>}
              <span className="g-cat" style={{background:`${cc}15`,color:cc}}>{v.cat}</span>
              <span className="g-st">{mastered.has(v.id)?"✅":learning.has(v.id)?"📚":"🔲"}</span>
            </div>
            <div className="g-meaning">{v.meaning}</div>
            <div className="g-eg">"{v.example}"</div>
            <div className="g-hint">{v.hint}</div>
          </div>
        );
      })}
      {list.length === 0 && <div className="empty">No results found.</div>}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [mastered, setMastered] = useState(new Set());
  const [learning, setLearning] = useState(new Set());

  const toggleMastered = useCallback((id) => {
    setMastered(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setLearning(s => { const n = new Set(s); n.delete(id); return n; });
  }, []);

  const toggleLearning = useCallback((id) => {
    setLearning(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setMastered(s => { const n = new Set(s); n.delete(id); return n; });
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Topbar n={mastered.size} total={VERBS.length} />
        {tab === "home"     && <HomePage mastered={mastered} learning={learning} setTab={setTab} />}
        {tab === "flash"    && <FlashPage mastered={mastered} learning={learning} toggleMastered={toggleMastered} toggleLearning={toggleLearning} />}
        {tab === "quiz"     && <QuizPage key="quiz" />}
        {tab === "fill"     && <FillPage key="fill" />}
        {tab === "rapid"    && <RapidPage key="rapid" />}
        {tab === "match"    && <MatchPage key="match" />}
        {tab === "glossary" && <GlossaryPage mastered={mastered} learning={learning} />}
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </>
  );
}
