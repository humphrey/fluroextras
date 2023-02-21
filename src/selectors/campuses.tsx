import { useFluroContext } from "../fluroapi/context";

interface CampusInfo {
  _id: string
  title: string
}

export const useSelectCampuses = () => {
  const fluro = useFluroContext();
  const values: {[id: string]: CampusInfo} = {};
  for (let p of Object.values(fluro.auth.data?.permissionSets ?? {})) {
    if (p.definition === 'campus') {
      values[p._id] = {_id: p._id, title: p.title};
    }
    if (p.children) {
      for (let c of p.children) {
        if (c.definition === 'campus') {
          values[c._id] = {_id: c._id, title: c.title};
        }
      }
    }
  }
  return Object.values(values).sort((a,b) => a.title.localeCompare(b.title));
}