// Run: node tests/lessons.test.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(script);
const saved={done:[0,21],labDone:[0,2],attempts:{21:3},fs:{'/':{dir:true},'/home':{dir:true},'/home/student':{dir:true},'/home/student/notes.txt':{text:'cours personnel'}}};
const storage=new Map([['linux_nexus_complete_2026',JSON.stringify(saved)]]);
const nodes=new Map();
const context=vm.createContext({document:{getElementById(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',focus(){}});return nodes.get(id)},addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{scrollTo(){}},TextEncoder,console});
vm.runInContext(script+'\nthis.api={COMMANDS,LABS,lessonExplanations,lesson,state,execute,save};',context,{timeout:5000});
const {COMMANDS,LABS,lessonExplanations,lesson,state,execute,save}=context.api;
assert.equal(COMMANDS.length,79);assert.equal(LABS.length,7);assert.equal(lessonExplanations.length,79);
assert.equal(new Set(Array.from(lessonExplanations)).size,79,'each lesson must have distinct explanation');
for(let i=0;i<79;i++){
 state.active=i;const page=lesson();
 assert.ok(page.includes('Comprendre : '+COMMANDS[i].name),'missing specific heading '+i);
 assert.ok(page.includes(lessonExplanations[i].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),'missing explanation '+i);
 assert.ok(page.includes('Contexte du domaine :'),'domain context lost '+i);
 assert.ok(page.includes('Mission de commande'),'training missing '+i);
}
state.active=21;assert.match(lesson(),/éditeur de flux/);
state.active=22;assert.match(lesson(),/écrit le même flux/);
assert.equal(execute('whoami').out.trim(),'student');
assert.equal(execute('cat /home/student/notes.txt').out.trim(),'cours personnel');
assert.equal(state.done.size,2);assert.equal(state.labDone.size,2);assert.equal(state.attempts[21],3);
save();const persisted=JSON.parse(storage.get('linux_nexus_complete_2026'));
assert.deepEqual(persisted.done,[0,21]);assert.deepEqual(persisted.labDone,[0,2]);
assert.equal(persisted.fs['/home/student/notes.txt'].text,'cours personnel');
console.log('PASS 79 distinct lessons, domain context, training, terminal, 7 labs, persisted progress and files');
