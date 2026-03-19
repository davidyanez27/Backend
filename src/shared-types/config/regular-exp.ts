export const regularExps = {

    // email
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  
    //password
    password: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,

    //Username
    username: /^[a-zA-Z0-9_-]{3,30}$/,

    //String 
    string: /^[A-Za-z\s]+$/,

    //UUID
    uuidV4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

    //Name - letters, numbers, spaces, hyphens, underscores
    name: /^[A-Za-z0-9\s\-_]+$/,

    //Slug - lowercase letters, numbers, hyphens, underscores
    slug: /^[a-z0-9\-_]+$/,

    //Status/Type - letters, numbers, spaces, hyphens, underscores
    status: /^[A-Za-z0-9\s\-_]+$/,

    //Phone - basic phone validation
    phone: /^[\+]?[0-9\s\-\(\)]{7,20}$/,

    //JWT Token - basic JWT format validation
    jwtToken: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/

  }