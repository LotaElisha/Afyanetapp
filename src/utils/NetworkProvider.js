import React from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({isConnected: true});

export class NetworkProvider extends React.PureComponent {
    state = {
        isConnected: true
    };

    componentDidMount() {
        NetInfo.addEventListener(this.handleConnectivityChange);
    }


    handleConnectivityChange = isConnected => this.setState({isConnected});

    render() {
        return (
            <NetworkContext.Provider value={this.state}>
                {this.props.children}
            </NetworkContext.Provider>
        );
    }
}
