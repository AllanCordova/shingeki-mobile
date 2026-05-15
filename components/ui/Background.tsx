import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";

const BANNER = require("../../assets/banner-fintech.jpg");

export function Background() {
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}
    >
      <Image
        source={BANNER}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFillObject,
          { width: "100%", height: "100%" },
          Platform.OS === "web"
            ? ({ objectFit: "cover", objectPosition: "top center" } as object)
            : undefined,
        ]}
      />
    </View>
  );
}
