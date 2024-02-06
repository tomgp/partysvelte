export function load({cookies, params}) {
  const userid = cookies.get('userid');
  let room = 'common-room';
  if(params.room){
    room = params.room;
  }
  return { userid, room };
}