# TODO (mvp)

- rename "random" to "shuffle"

- one app w/ routes instead of frankenstein

- "shuffle" view (+quoteId)

- "home" view

- urlId in route to specify user
    - if no find, authed
    - if no authed, default


## URL route proposal:

- quote.garden/#/${urlId}/${viewName}/${quoteId}
    - ex: quote.garden/#/cheeeese/shuffle/348

- redirect: quote.garden/#/cheeeese >>> quote.garden/#/cheeeese/shuffle

- redirect: quote.garden/#/all
    - AUTHED >>> quote.garden/#/cheeeese/all
    - NOAUTH >>> quote.garden/#/default/all


# TODO (deluxe)

- form validation errors

- email verification

- forgot password link

- short id / inc id for quotes


# TODO (selfish)

- migrate old mysql quotes to firebase somehow