import { StyleSheet } from "react-native";

export const colors = {
    primary: {
        50: '#F6F7FE',
        100: '#E3E7FD',
        200: '#C6CFFA',
        300: '#A1AFF7',
        400: '#7B87F4',
        500: '#1D13EC',
        600: '#150EAB',
        700: '#0D0868',
        800: '#09064B',
        900: '#03021C',
    },
    secondary: {
        50: '#FCEEFC',
        100: '#FAE5FA',
        200: '#F6CBF6',
        300: '#F0A8F0',
        400: '#E87DE8',
        500: '#E052E0',
        600: '#BA21BA',
        700: '#821782',
        800: '#570F57',
        900: '#2B082B',
    },
    neutral: {
        50: '#F4F4F5',
        100: '#E4E4E7',
        200: '#AEAEB7',
        300: '#94949E',
        400: '#797986',
        500: '#484851',
        600: '#27272B',
        700: '#1D1D20',
        800: '#131315',
        900: '#09090A',
    },
    success: {
        50: '#F0FDE7',
        200: '#C2F7A1',
        400: '#66EC13',
        500: '#51BD0F',
        700: '#295E08',
    },
    warning: {
        50: '#FEFAF1',
        200: '#FAEAC7',
        400: '#D7B642',
        500: '#BD9D28',
        700: '#544612',
    },
    danger: {
        50: '#FEF6F6',
        100: '#FCDEDE',
        200: '#FAC7C7',
        300: '#F7A1A1',
        400: '#EE2B2B',
        500: '#D41111',
        700: '#5E0808',
    },

    black: '#000000',
    white: '#FFFFFF',
}

const baseText = {
    fontSize: 11,
    color: colors.neutral[900],
};

const baseButton = {
    backgroundColor: colors.primary[500],
    tintColor: colors.white,
    padding: 10,
    borderRadius: 4,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
};

const baseTab = {
    pressable: ({ pressed }: { pressed: boolean }) => ({
        paddingVertical: 16,
        paddingHorizontal: 8,

        ...(pressed && {
            borderBottomWidth: 2,
            borderColor: colors.primary[600],
        })
    }),
    text: {
        fontSize: 16,
        // font: medium,
        color: colors.neutral[300],
    },
};

const baseChip = {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 14
};

export const globalStyles: {
    [key: string]: StyleSheet.NamedStyles<any>;
} = StyleSheet.create({
    container: {},
    text: {
        sm: {
            ...baseText,
            fontSize: 11,
        },
        md: {
            ...baseText,
            fontSize: 14,
        },
        lg: {
            ...baseText,
            fontSize: 18,
        },
        xl: {
            ...baseText,
            fontSize: 22,
        },
        xxl: {
            ...baseText,
            fontSize: 32,
        },

        thin: {
            fontFamily: "Inter_100Thin",
        },
        extraLight: {
            fontFamily: "Inter_200ExtraLight",
        },
        light: {
            fontFamily: "Inter_300Light",
        },
        regular: {
            fontFamily: "Inter_400Regular",
        },
        medium: {
            fontFamily: "Inter_500Medium",
        },
        semiBold: {
            fontFamily: "Inter_600SemiBold",
        },
        bold: {
            fontFamily: "Inter_700Bold",
        },
        extraBold: {
            fontFamily: "Inter_800ExtraBold",
        },
        black: {
            fontFamily: "Inter_900Black",
        },


    },
    button: {
        primary: ({ pressed }: { pressed: boolean }) => ({
            ...baseButton,
            backgroundColor: pressed ? colors.primary[600] : colors.primary[500],
        }),
        secondary: ({ pressed }: { pressed: boolean }) => ({
            ...baseButton,
            backgroundColor: pressed ? colors.primary[100] : colors.primary[50],
        }),
        disabled: {
            ...baseButton,
            opacity: .75,
            // backgroundColor: colors.primary[300],
        },
    },
    tab: {
        base: {
            ...baseTab,
        },
        active: {
            pressable: ({ pressed }) => ({
                ...baseTab.pressable({ pressed }),
                borderBottomWidth: 2,
                // font: semiBold,
                borderColor: colors.primary[600],
            }),
            text: {
                ...baseTab.text,
                color: colors.primary[500],
            },
        }
    },
    chip: {
        primary: {
            ...baseChip,
            backgroundColor: colors.primary[100],
            color: colors.primary[600],
            borderColor: colors.primary[600],
        },
        secondary: {
            ...baseChip,
            backgroundColor: colors.secondary[50],
            color: colors.secondary[500],
            borderColor: colors.secondary[500],
        },
        success: {
            ...baseChip,
            backgroundColor: colors.success[50],
            color: colors.success[500],
            borderColor: colors.success[500],
        },
        warning: {
            ...baseChip,
            backgroundColor: colors.warning[50],
            color: colors.warning[500],
            borderColor: colors.warning[500],
        },
        danger: {
            ...baseChip,
            backgroundColor: colors.danger[50],
            color: colors.danger[500],
            borderColor: colors.danger[500],
        },
    }
});