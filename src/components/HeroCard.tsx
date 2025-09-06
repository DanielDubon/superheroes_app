import React, { memo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Hero } from "../types/superhero";
import { colors } from "../theme/colors";
import Heart from "../../assets/medium-heart/medium-heart.svg";
import FilledHeart from "../../assets/medium-filled-heart/medium-filled-heart.svg";
import Fist from "../../assets/fist/fist.svg";
import { fonts } from '../theme/typography';

type Props = {
  hero: Hero;
  fav: boolean;
  onToggle: (id: number) => void;
};

function HeroCard({ hero, fav, onToggle }: Props) {

  const fullName = hero.biography?.fullName || "—";

 return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.imgWrap}>
          <Image source={{ uri: hero.images.md }} style={styles.img} />
          <Pressable
            onPress={() => onToggle(hero.id)}
            style={[styles.favBtn, {backgroundColor: colors.heartplaceholder}]}
            hitSlop={10}
          >
            {fav ? <FilledHeart width={18} height={18} /> : <Heart width={18} height={18} />}
          </Pressable>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{hero.name}</Text>
          <Text style={styles.subtitle}>{fullName}</Text>
          <View style={styles.stats}>
            <Fist width={18} height={18} />
            <Text style={styles.statText}>
              {hero.powerstats.intelligence} <Text style={styles.outOf}>/ 100</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(HeroCard);

const R = 16;
const IMG_W = 170;
const IMG_H = 190;

const styles = StyleSheet.create({

  card: { 
    backgroundColor: colors.Herocard, 
    borderRadius: R, 
    overflow: "hidden" 
},

  row: { 
    flexDirection: "row", 
    minHeight: IMG_H,
},


  imgWrap: { 
    width: IMG_W,
    height: IMG_H,
    position: "relative",
 },
  img: { 
    width: IMG_W,
    height: IMG_H, 
},

  favBtn: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",    
    paddingTop: 15,
    paddingRight: 12,
    paddingLeft: 16,           
    gap: 1,
    fontFamily: fonts.semiBold,                        
  },

  title: { color: colors.text, fontSize: 18, fontFamily: fonts.semiBold },
  subtitle: { color: colors.subtext, marginTop: 4, fontSize: 12, fontFamily: fonts.semiBold},
  stats: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6},
  statText: { color: colors.text, fontWeight: "700", fontSize: 12 , fontFamily: fonts.semiBold},
  outOf: { color: colors.subtext, fontFamily: fonts.semiBold },
});
