# TODO

- form validation errors

- one app w/ routes instead of frankenstein

- "all" view (+urlId)

- "shuffle" view (+urlId +quoteId)

- "home" view

- default user for home + unauthed all & shuffle


## URL route proposal:

- quote.garden/#/${urlId}/${viewName}/${quoteId}

- ex: quote.garden/#/cheeeese/all

- redirect: quote.garden/#/cheeeese >>> quote.garden/#/cheeeese/shuffle

- redirect: quote.garden/#/all >>> quote.garden/#/default/all



#### HMMM orrrr

- quote.garden/#/${viewName}/${urlId}/${quoteId}

- ex: quote.garden/#/all/cheeeese

- redirect: quote.garden/#/cheeeese >>> quote.garden/#/shuffle/cheeeese

- redirect: quote.garden/#/all >>> quote.garden/#/all/default