import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { State } from 'src/redux/state'

interface RouteParams {
  qnum: string
}

interface StateProps {}

type Props = RouteComponentProps<RouteParams> & StateProps

const Edit = (props: Props): JSX.Element => {
  console.log('Edit', props.match.params.qnum, props)
  return <div>Edit</div>
}

const mapStateToProps = ({  }: State): StateProps => ({})

export default withRouter(connect(mapStateToProps)(Edit))
