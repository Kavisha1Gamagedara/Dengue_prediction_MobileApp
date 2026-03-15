import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const exploreStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    mapPlaceholder: {
        height: height * 0.45,
        marginHorizontal: 24,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    mapGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    marker: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 12,
        borderRadius: 16,
    },
    mapStatus: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
    legendContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendLabel: {
        fontSize: 13,
        color: '#95A5A6',
        fontWeight: '600',
    },
    infoCard: {
        marginHorizontal: 24,
        padding: 16,
    },
    infoContent: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    infoDesc: {
        fontSize: 14,
    },
});
