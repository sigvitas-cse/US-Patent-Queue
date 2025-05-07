const sanitizeInventor = (inventor) => {
    const cleanField = (field) => {
      if (typeof field !== 'string') return field || '';
      return field.split(/\r?\n/)[0].trim();
    };
  
    return {
      first_name: cleanField(inventor.first_name),
      last_name: cleanField(inventor.last_name),
      city: cleanField(inventor.city),
      state: cleanField(inventor.state),
      country: cleanField(inventor.country)
    };
  };
  
  export default sanitizeInventor;