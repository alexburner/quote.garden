import * as React from 'react'
import { connect } from 'react-redux'
import { Route, withRouter } from 'react-router-dom'

import { State } from 'src/singletons/interfaces'

interface RouteProps { match: any }
interface StateProps { }
type Props = RouteProps & StateProps;

const Test = () => <div>Test</div>

const Shuffle = (props: Props): JSX.Element => {
  console.log(props);
  return (
    <div>

    </div>
  )
}

const mapStateToProps = ({  }: State): StateProps => ({})

export default withRouter(connect(mapStateToProps)(Shuffle))
