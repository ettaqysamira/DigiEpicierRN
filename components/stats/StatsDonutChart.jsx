import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

const screenWidth = Dimensions.get("window").width;

const data = [
    { name: "Fruits & Légumes", value: 35, color: "#4CAF50" },
    { name: "Produits laitiers", value: 25, color: "#2196F3" },
    { name: "Boulangerie", value: 20, color: "#FF9800" },
    { name: "Épicerie", value: 15, color: "#9C27B0" },
    { name: "Autres", value: 5, color: "#607D8B" },
];

export default function StatsDonutChart({ data = [] }) {
    if (data.length === 0) {
        return (
            <View className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100 items-center justify-center h-48">
                <Text className="text-gray-400 font-medium">Aucune donnée par catégorie</Text>
            </View>
        );
    }

    const size = 180;
    const radius = size / 2;
    const strokeWidth = 50;
    const innerRadius = radius - strokeWidth;
    const center = radius;

    let startAngle = 0;

    return (
        <View className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-8">Ventes par catégorie</Text>

            <View className="flex-row items-center justify-between">
                <View style={{ width: size, height: size }} className="items-center justify-center">
                    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <G transform={`translate(${center}, ${center})`}>
                            {data.map((item, index) => {
                                const angle = (item.value / 100) * 360;
                                const endAngle = startAngle + angle;

                                const x1 = radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
                                const y1 = radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
                                const x2 = radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
                                const y2 = radius * Math.sin((Math.PI * (endAngle - 90)) / 180);

                                const ix1 = innerRadius * Math.cos((Math.PI * (startAngle - 90)) / 180);
                                const iy1 = innerRadius * Math.sin((Math.PI * (startAngle - 90)) / 180);
                                const ix2 = innerRadius * Math.cos((Math.PI * (endAngle - 90)) / 180);
                                const iy2 = innerRadius * Math.sin((Math.PI * (endAngle - 90)) / 180);

                                const largeArcFlag = angle > 180 ? 1 : 0;

                                const d = [
                                    `M ${x1} ${y1}`,
                                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                    `L ${ix2} ${iy2}`,
                                    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
                                    'Z'
                                ].join(' ');

                                const labelAngle = startAngle + angle / 2;
                                const labelRadius = innerRadius + strokeWidth / 2;
                                const lx = labelRadius * Math.cos((Math.PI * (labelAngle - 90)) / 180);
                                const ly = labelRadius * Math.sin((Math.PI * (labelAngle - 90)) / 180);

                                const currentStart = startAngle;
                                startAngle = endAngle;

                                return (
                                    <G key={index}>
                                        <Path d={d} fill={item.color} stroke="white" strokeWidth="2" />
                                        {item.value >= 5 && (
                                            <SvgText
                                                x={lx}
                                                y={ly}
                                                fill="white"
                                                fontSize="12"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                alignmentBaseline="middle"
                                            >
                                                {`${Math.round(item.value)}%`}
                                            </SvgText>
                                        )}
                                    </G>
                                );
                            })}
                        </G>
                    </Svg>
                    <View className="absolute bg-white rounded-full" style={{ width: innerRadius * 2 - 4, height: innerRadius * 2 - 4 }} />
                </View>

                <View className="flex-1 ml-6">
                    {data.map((item, index) => (
                        <View key={index} className="flex-row items-center mb-4">
                            <View style={{ backgroundColor: item.color }} className="w-4 h-4 rounded-full mr-3" />
                            <View>
                                <Text className="text-gray-700 text-xs font-semibold">{item.name}</Text>
                                <Text className="text-gray-400 text-[10px]">{Math.round(item.value)}%</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
