export function load({cookies}) {
  const userid = cookies.get('userid');
  return { userid };
}