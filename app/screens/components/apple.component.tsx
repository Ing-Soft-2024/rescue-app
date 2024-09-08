import * as AppleAuthentication from "expo-apple-authentication";
export const AppleSignInComponent = () => {

    return (
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={({
                display: 'flex',
                padding: 20,
                // backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                borderRadius: 5,
            })}
            onPress={async () => {
                try {
                    const credential = await AppleAuthentication.signInAsync({
                        requestedScopes: [
                            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                        ],
                    });
                    // signed in
                } catch (e) {
                    // if (e.code === 'ERR_REQUEST_CANCELED') {
                    //     // handle that the user canceled the sign-in flow
                    // } else {
                    //     // handle other errors
                    // }
                }
            }}
        />
    )
}