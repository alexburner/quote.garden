import * as React from 'react'
import { Route } from 'react-router-dom'

import Auth from 'src/components/Auth'
import User from 'src/components/User'

export default (): JSX.Element => {
  return (
    <div>
      Hello App
      <Route path="/auth" component={Auth} />
      <Route path="/:userKey" component={User} />
    </div>
  )
}
