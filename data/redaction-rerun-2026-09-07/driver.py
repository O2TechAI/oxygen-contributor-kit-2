import importlib.util,json,re,sys
from pathlib import Path
KIT=Path('/n/holylabs/hlakkaraju_lab/Lab/zidi/user_simulation/oxygen-contributor-kit-2')
BASE=KIT/'data/redaction-rerun-2026-09-07'
OLD=KIT/'data/stripped-trajectories-2026-09-07'
s=importlib.util.spec_from_file_location('runner',KIT/'skills/oxygen-deterministic-trajectory-agents/scripts/trajectory_agents.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
LOG=BASE/'progress.json'
if sys.argv[1]=='prepare':
 BASE.mkdir(mode=0o700)
 old_report=json.loads(m.read_regular(OLD/'deterministic-batch-report.json'))
 items=[]
 for n in range(1,17):
  name=f'trajectory-{n:03d}.jsonl';original=OLD/'trajectories'/name;prior=Path(str(original)+'.oxygen-agents');previous=json.loads(m.read_regular(prior/'manifest.json'))
  raw=m.read_regular(original);assert m.sha(raw)==previous['input_sha256'];assert raw==m.read_regular(prior/'trajectory.json')
  source=BASE/name;m.write_new(source,raw);m.prepare(source);run=Path(str(source)+'.oxygen-agents');provenance={};normalizations=0
  for filename in m.STAGES['summary'][1]:
   data=m.read_regular(prior/'summary'/filename);expected=old_report['items'][n-1]['artifacts']['summary/'+filename]['sha256'];assert m.sha(data)==expected
   provenance[filename]={'source':str(prior/'summary'/filename),'original_sha256':m.sha(data)}
   if n==8 and filename=='insight.md':
    summary=m.read_regular(prior/'summary/summary.md').decode();ids=set(re.findall(r'(?m)^(L\d+) ',summary))
    def expand(match):
     global normalizations
     refs=[]
     for ref in match[1].split(','):
      ref=ref.strip();span=re.fullmatch(r'L(\d+)-L(\d+)',ref)
      if span:
       start,end=map(int,span.groups());assert start<=end;refs.extend(f'L{i:03d}' for i in range(start,end+1));normalizations+=1
      else:refs.append(ref)
     assert set(refs)<=ids and len(refs)==len(set(refs))
     return 'Evidence: '+', '.join(refs)
    data=re.sub(r'(?m)^Evidence: (.+)$',expand,data.decode()).encode()
   m.write_new(run/'summary'/filename,data);provenance[filename]['imported_sha256']=m.sha(data)
  accepted=m.validate_pair(run/'summary','summary')
  manifest=m.load_run(source,run);manifest['stages']['summary']={'status':'complete','origin':'imported_previous_worker_outputs','outputs':accepted,'provenance':provenance,'evidence_ranges_expanded':normalizations,'previous_manifest_sha256':m.sha(m.read_regular(prior/'manifest.json')),'previous_summary_call_sha256':m.sha(m.read_regular(prior/'summary-call.json'))}
  manifest['resubmission']={'authorization':'User requested resubmission with the revised redaction prompt.','previous_run':str(prior),'summary_worker_rerun':False};m.save_manifest(run,manifest)
  items.append({'input_json_path':str(source),'status':'prepared','evidence_ranges_expanded':normalizations})
 config=m.configuration();assert all(m.load_run(Path(r['input_json_path']),Path(r['input_json_path']+'.oxygen-agents'))['configuration']==config for r in items)
 m.write_new(LOG,m.encode({'configuration':config,'items':items}));m.write_new(BASE/'driver.py',Path(__file__).read_bytes());print(json.dumps({'prepared':len(items),'normalized_evidence_ranges':sum(r['evidence_ranges_expanded'] for r in items),'output_directory':str(BASE)}))
else:
 v=json.loads(m.read_regular(LOG));row=v['items'][int(sys.argv[2])-1];source=Path(row['input_json_path'])
 action=sys.argv[1]
 try:
  if action=='issue':
   args=m.issue_call(source,'redaction');print(json.dumps(args if len(sys.argv)>3 else {k:v for k,v in args.items() if k!='message'}))
  elif action=='spawned':
   args=json.loads(m.read_regular(Path(str(source)+'.oxygen-agents/redaction-call.json')));row.update(status='running',agent='/root/'+args['task_name'])
  elif action=='accept':
   row['worker_final_status']='complete';result=m.accept(source,'redaction');row.update(status='complete',result=result);print(json.dumps({'input':source.name,**result}))
  else:raise ValueError('unknown action')
 except m.RunError as e:
  row.update(status='validation_failed',reason=str(e));LOG.write_bytes(m.encode(v));print(json.dumps({'input':source.name,'status':row['status'],'reason':str(e)}));sys.exit(1)
 LOG.write_bytes(m.encode(v))
