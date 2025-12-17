export default function getDefaultValuesFrom(schema) {
  const defaults = {};

  Object.entries(schema)
      .forEach(([ name, yupDef ]) => {
        defaults[name] = yupDef.getDefault() ?? '';
      });

  return defaults;
}
