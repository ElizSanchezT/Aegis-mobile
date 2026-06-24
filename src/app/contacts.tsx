import { Contact, requestPermissionsAsync } from 'expo-contacts';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SubHeader } from '@/components/aegis/app-header';
import { Avatar } from '@/components/aegis/avatar';
import { IconPlus, IconShield } from '@/components/aegis/icons';
import { TabBar } from '@/components/aegis/tab-bar';
import { contactApi, type ApiContact } from '@/api/contact';
import { useAppContext } from '@/contexts/app-context';
import { Brand, Canvas, Ink, Line, Shadow } from '@/constants/theme';

const MAX_CONTACTS = 5;
const AVATAR_COLORS = ['#f4a25a', '#5a9bf4', '#ef7a92', '#8669f5', '#4caf79'];

export default function ContactsScreen() {
  const { userId } = useAppContext();

  const [contacts, setContacts] = useState<ApiContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingContact, setPendingContact] = useState<{ name: string; phone: string | null } | null>(null);
  const [alias, setAlias] = useState('');

  async function fetchContacts() {
    if (!userId) { setLoading(false); return; }
    try {
      const data = await contactApi.getByUser(userId);
      setContacts(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los contactos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleAdd() {
    if (contacts.length >= MAX_CONTACTS) {
      Alert.alert('Límite alcanzado', `Puedes tener un máximo de ${MAX_CONTACTS} contactos.`);
      return;
    }

    const { status } = await requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus contactos para agregar uno.');
      return;
    }

    const picked = await Contact.presentPicker();
    if (!picked) return;

    const fullName = await picked.getFullName();
    const phones = await picked.getPhones();
    const phone = phones[0]?.number ?? null;

    if (!fullName && !phone) return;

    setAlias('');
    setPendingContact({ name: fullName ?? '', phone });
  }

  async function handleConfirmAdd(pickedAlias: string | null) {
    if (!pendingContact || !userId) { setPendingContact(null); return; }
    setPendingContact(null);
    try {
      const created = await contactApi.add({
        userId,
        name: pendingContact.name,
        phone: pendingContact.phone,
        alias: pickedAlias || null,
      });
      setContacts(prev => [...prev, { ...created, alertEnabled: true }]);
    } catch {
      Alert.alert('Error', 'No se pudo agregar el contacto.');
    }
  }

  async function handleToggle(contact: ApiContact) {
    if (!userId) return;
    const flipped = !contact.alertEnabled;
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, alertEnabled: flipped } : c));
    try {
      const updated = await contactApi.toggleAlert(contact.id, userId);
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, ...updated, alertEnabled: updated.alertEnabled ?? flipped } : c));
    } catch {
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, alertEnabled: contact.alertEnabled } : c));
      Alert.alert('Error', 'No se pudo actualizar el contacto.');
    }
  }

  async function handleDelete(contact: ApiContact) {
    if (!userId) return;
    Alert.alert(
      'Eliminar contacto',
      `¿Eliminar a ${contact.name} de tus contactos de confianza?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await contactApi.remove(contact.id, userId);
              setContacts(prev => prev.filter(c => c.id !== contact.id));
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el contacto.');
            }
          },
        },
      ]
    );
  }

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
          contacts.length < MAX_CONTACTS ? (
            <Pressable style={styles.addBtn} onPress={handleAdd} accessibilityLabel="Agregar contacto">
              <IconPlus size={20} color={Brand[700]} />
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.introblurb}>
          Las personas seleccionadas recibirán tu alerta y ubicación en caso de emergencia.
          {contacts.length > 0 && ` (${contacts.length}/${MAX_CONTACTS})`}
        </Text>

        {loading ? (
          <ActivityIndicator color={Brand[600]} style={styles.loader} />
        ) : contacts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aún no tienes contactos de confianza.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={handleAdd}>
              <Text style={styles.emptyBtnText}>Agregar contacto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contactList}>
            {contacts.map((c, i) => (
              <ContactCard
                key={c.id}
                contact={c}
                color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}

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

      <Modal
        visible={pendingContact !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingContact(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPendingContact(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>{pendingContact?.name}</Text>
            <Text style={styles.modalSub}>¿Cuál es tu relación con esta persona?</Text>
            <Text style={styles.modalLabel}>Relación</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Hermana, Mejor amiga… (opcional)"
              placeholderTextColor={Ink[300]}
              value={alias}
              onChangeText={setAlias}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => handleConfirmAdd(alias)}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSkip}
                onPress={() => handleConfirmAdd(null)}
              >
                <Text style={styles.modalSkipText}>Omitir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={() => handleConfirmAdd(alias)}
              >
                <Text style={styles.modalConfirmText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

type ContactCardProps = {
  contact: ApiContact;
  color: string;
  onToggle: (c: ApiContact) => void;
  onDelete: (c: ApiContact) => void;
};

function ContactCard({ contact: c, color, onToggle, onDelete }: ContactCardProps) {
  return (
    <View style={styles.card}>
      <Avatar name={c.name} color={color} kind="person" size={48} />
      <View style={styles.cardBody}>
        <Text style={styles.name}>{c.name}</Text>
        {c.alias ? <Text style={styles.rel}>{c.alias}</Text> : null}
        {c.phone ? <Text style={styles.phone}>{c.phone}</Text> : null}
        <View style={styles.tagRow}>
          <View style={[styles.tag, c.alertEnabled ? styles.tagOn : styles.tagOff]}>
            <Text style={[styles.tagText, c.alertEnabled ? styles.tagTextOn : styles.tagTextOff]}>
              {c.alertEnabled ? 'Recibirá alerta' : 'No recibirá'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.switchTrack, c.alertEnabled && styles.switchOn]}
          onPress={() => onToggle(c)}
          accessibilityLabel={`${c.alertEnabled ? 'Desactivar' : 'Activar'} ${c.name}`}
          accessibilityRole="switch"
          accessibilityState={{ checked: c.alertEnabled }}
        >
          <View style={[styles.switchThumb, c.alertEnabled && styles.switchThumbOn]} />
        </Pressable>

        <Pressable
          style={styles.deleteBtn}
          onPress={() => onDelete(c)}
          accessibilityLabel={`Eliminar ${c.name}`}
          hitSlop={6}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </Pressable>
      </View>
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
  loader: { marginTop: 40 },
  empty: { alignItems: 'center', paddingTop: 48, gap: 16 },
  emptyText: { fontSize: 15, color: Ink[500] },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Brand[600],
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  addBtn: {
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
  tagText: { fontSize: 11.5, fontWeight: '600' },
  tagTextOn: { color: '#137a3f' },
  tagTextOff: { color: Ink[500] },

  actions: { alignItems: 'center', gap: 10 },
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
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#fff0f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { color: '#c0392b', fontSize: 13, fontWeight: '700' },

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

  /* Alias modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Ink[900],
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13.5,
    color: Ink[500],
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: Ink[500],
    marginBottom: 8,
  },
  modalInput: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Line,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Ink[900],
    backgroundColor: '#fafafa',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalSkip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSkipText: {
    fontSize: 15,
    fontWeight: '600',
    color: Ink[500],
  },
  modalConfirm: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Brand[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
