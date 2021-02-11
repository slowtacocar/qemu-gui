import React from "react";

export function useFetch(resource, init) {
  const [json, setJSON] = React.useState();
  const [update, setUpdate] = React.useState(() => () => alert("hi"));
  React.useEffect(() => {
    async function getJSON() {
      const response = await fetch(`api/${resource}`, init);
      setJSON(await response.json());
    }

    setUpdate(() => getJSON);
    getJSON();
  }, [resource, init]);

  return [json, update];
}

export function useFetchAll(prefix, resources, suffix, init) {
  const [jsons, setJSONs] = React.useState([]);
  React.useEffect(() => {
    async function getJSONs() {
      if (resources) {
        const responses = await Promise.all(
          resources.map((resource) =>
            fetch(`api/${prefix}/${resource}/${suffix}`, init)
          )
        );
        setJSONs(
          await Promise.all(responses.map((response) => response.json()))
        );
      }
    }

    getJSONs();
  }, [init, resources, prefix, suffix]);
  return [jsons];
}
