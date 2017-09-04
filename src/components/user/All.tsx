import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { State } from 'src/interfaces'

interface RouteParams {
  qnum: string
}

interface StateProps {}

type Props = RouteComponentProps<RouteParams> & StateProps

const All = (props: Props): JSX.Element => {
  console.log('All', props.match.params.qnum, props)
  return <div>All</div>
}

const mapStateToProps = ({  }: State): StateProps => ({})

export default withRouter(connect(mapStateToProps)(All))
