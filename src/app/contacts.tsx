import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SubHeader } from '@/components/aegis/app-header';
import { Avatar } from '@/components/aegis/avatar';
import { IconPlus, IconShield } from '@/components/aegis/icons';
import { TabBar } from '@/components/aegis/tab-bar';
import { useAppContext, type Contact } from '@/contexts/app-context';
import { Brand, Canvas, Ink, Line, Shadow } from '@/constants/theme';

export default function ContactsScreen() {
  const { contacts, setContacts } = useAppContext();

  const toggle = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, on: !c.on } : c));
  };

  const handleTabChange = (tab: 'home' | 'contacts' | 'resources' | 'settings') => {
    if (tab === 'contacts') return;
    router.replace(tab === 'home' ? '/' : `/${tab}` as '/resources' | '/settings');
  };

  return (
    <View style={styles.screen}>
      <SubHeader
        title="Contactos de confianza"
        onBack={() => router.replace('/')}
        rightIcon={
          <Pressable style={styles.solidBtn} accessibilityLabel="Agregar">
            <IconPlus size={20} color={Brand[700]} />
          </Pressable>
        }
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.introblurb}>
          Las personas seleccionadas recibirán tu alerta y ubicación en caso de emergencia.
        </Text>

        <View style={styles.contactList}>
          {contacts.map(c => <ContactCard key={c.id} contact={c} onToggle={toggle} />)}
        </View>

        <View style={styles.footerTip}>
          <View style={styles.footerIco}>
            <IconShield size={20} color={Brand[600]} />
          </View>
          <Text style={styles.footerText}>
            Tus contactos serán notificados por notificaciones push, SMS y WhatsApp (si aplica).
          </Text>
        </View>
      </ScrollView>

      <TabBar active="contacts" onChange={handleTabChange} />
    </View>
  );
}

function ContactCard({ contact: c, onToggle }: { contact: Contact; onToggle: (id: string) => void }) {
  return (
    <View style={styles.card}>
      <Avatar name={c.name} color={c.color} kind={c.kind} size={48} />
      <View style={styles.cardBody}>
        <Text style={styles.name}>{c.name}</Text>
        <Text style={styles.rel}>{c.rel}</Text>
        <Text style={styles.phone}>{c.phone}</Text>
        <View style={styles.tagRow}>
          {c.kind === 'community' ? (
            <View style={[styles.tag, styles.tagCommunity]}>
              <Text style={styles.tagTextCommunity}>Apoyo comunitario</Text>
            </View>
          ) : (
            <View style={[styles.tag, c.on ? styles.tagOn : styles.tagOff]}>
              <Text style={[styles.tagText, c.on ? styles.tagTextOn : styles.tagTextOff]}>
                {c.on ? 'Recibirá alerta' : 'No recibirá'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Pressable
        style={[styles.switchTrack, c.on && styles.switchOn]}
        onPress={() => onToggle(c.id)}
        accessibilityLabel={`${c.on ? 'Desactivar' : 'Activar'} ${c.name}`}
        accessibilityRole="switch"
        accessibilityState={{ checked: c.on }}
      >
        <View style={[styles.switchThumb, c.on && styles.switchThumbOn]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Canvas },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 78 + 12 },
  introblurb: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 14,
    lineHeight: 21,
    color: Ink[700],
  },
  solidBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactList: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Line,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    ...Shadow.sm,
  },
  cardBody: { flex: 1 },
  name: { fontWeight: '700', color: Ink[900], fontSize: 15 },
  rel: { fontSize: 12.5, color: Ink[500], marginTop: 1 },
  phone: { fontSize: 13.5, color: Ink[700], marginTop: 4 },
  tagRow: { flexDirection: 'row', marginTop: 8 },
  tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  tagOn: { backgroundColor: '#e7f8ee' },
  tagOff: { backgroundColor: '#ecebf2' },
  tagCommunity: { backgroundColor: '#ece4ff' },
  tagText: { fontSize: 11.5, fontWeight: '600' },
  tagTextOn: { color: '#137a3f' },
  tagTextOff: { color: Ink[500] },
  tagTextCommunity: { fontSize: 11.5, fontWeight: '600', color: '#4e2db8' },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#d7d3e2',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchOn: { backgroundColor: '#2ea35a' },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbOn: { alignSelf: 'flex-end' },
  footerTip: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: Brand[50],
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ddd2ff',
  },
  footerIco: { marginTop: 2 },
  footerText: { flex: 1, fontSize: 13, color: Brand[800], lineHeight: 19 },
});
