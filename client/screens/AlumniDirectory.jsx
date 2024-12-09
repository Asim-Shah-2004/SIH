import { SERVER_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { useAuth } from '../providers/AuthProvider';
import UserCard from '../utils/UserCard';

// const AlumniCard = ({ alumni, onConnect }) => (
//   <View className="border-overlay/20 m-1.5 flex-1 rounded-xl border bg-background p-4 shadow-md">
//     <View className="mb-2 flex-row items-center justify-end">
//       <View className="bg-primary/10 rounded-full px-2 py-0.5">
//         <Text className="text-2xs text-primary">{alumni.department}</Text>
//       </View>
//     </View>
//     <Image
//       source={{ uri: alumni.photo }}
//       className="border-primary/20 h-20 w-20 self-center rounded-full border-2"
//     />
//     <Text className="mt-2 text-center text-sm font-bold text-text" numberOfLines={1}>
//       {alumni.name}
//     </Text>
//     <Text className="text-primary/80 text-center text-xs" numberOfLines={1}>
//       {alumni.position}
//     </Text>
//     <Text className="text-text/60 text-center text-xs" numberOfLines={1}>
//       {alumni.company}
//     </Text>
//     <Text className="text-2xs text-text/40 text-center">
//       {alumni.batch.joining} - {alumni.batch.graduation}
//     </Text>
//     <TouchableOpacity
//       className={`mt-3 rounded-full px-4 py-2 shadow-sm ${alumni.isConnected ? 'bg-overlay' : 'bg-gradient-to-r from-primary to-secondary'
//         }`}
//       onPress={() => onConnect(alumni.id)}
//       disabled={alumni.isConnected}
//       activeOpacity={0.7}>
//       <Text
//         className={`text-center text-xs font-medium ${alumni.isConnected ? 'text-text/60' : 'text-background'}`}>
//         {alumni.isConnected ? 'Connected' : 'Connect'}
//       </Text>
//     </TouchableOpacity>
//   </View>
// );

const getAlumniFilters = (data) => {
  const filters = {
    graduationYear: [...new Set(data.map((alumni) => alumni.education[0].yearOfGraduation))].sort(),
    city: [...new Set(data.map((alumni) => alumni.city))],
    skills: [...new Set(data.flatMap((alumni) => alumni.skills))].sort(),
    company: [
      ...new Set(
        data.flatMap((alumni) => alumni.workExperience?.map((work) => work.company) || [])
      ),
    ]
      .filter(Boolean)
      .sort(),
  };

  return {
    'Graduation Year': filters.graduationYear,
    City: filters.city,
    Company: filters.company,
    Skills: filters.skills,
  };
};

const FilterDropdown = ({ title, options, selected = [], onSelect, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onSelect(newSelected);
  };

  return (
    <View className="z-50 mr-1.5">
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className={`flex-row items-center rounded-lg px-3.5 py-2.5 ${
          selected.length > 0 ? 'bg-accent/10' : 'bg-overlay'
        }`}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text
          className={`mr-2 text-xs font-semibold ${
            selected.length > 0 ? 'text-accent' : 'text-text/70'
          }`}>
          {title} {selected.length > 0 && `(${selected.length})`}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={14}
          className={selected.length > 0 ? 'text-accent' : 'text-text/50'}
        />
      </TouchableOpacity>

      {isOpen && (
        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
          statusBarTranslucent>
          <TouchableOpacity
            className="bg-overlay/80 absolute inset-0 flex-1"
            activeOpacity={1}
            onPress={() => setIsOpen(false)}>
            <View className="mx-4 mt-20 rounded-2xl bg-background p-4 shadow-xl">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-text">{title}</Text>
                {selected.length > 0 && (
                  <TouchableOpacity
                    className="bg-accent/10 rounded-full px-3 py-1"
                    onPress={() => {
                      onClear();
                      setIsOpen(false);
                    }}>
                    <Text className="text-xs font-medium text-accent">Clear</Text>
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView className="max-h-80">
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={`${option}-${index}`}
                    className={`mb-2 rounded-lg p-3 ${
                      selected.includes(option) ? 'bg-accent' : 'bg-overlay/5'
                    }`}
                    onPress={() => handleSelect(option)}>
                    <Text className={selected.includes(option) ? 'text-background' : 'text-text'}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const EmptyStateMessage = () => (
  <View className="flex-1 items-center justify-center px-6">
    <Ionicons name="people-outline" size={68} className="text-accent/20 mb-6" />
    <Text className="text-text/80 mb-3 text-center text-xl font-semibold">No Alumni Found</Text>
    <Text className="text-text/50 max-w-[280px] text-center text-sm leading-5">
      Try adjusting your filters or search terms to find more alumni
    </Text>
  </View>
);

const AlumniDirectory = () => {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alumniData, setAlumniData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/users/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlumniData(response.data);
      setFilteredData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch alumni data');
      console.error('Error fetching alumni:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAlumni();
    } finally {
      setRefreshing(false);
    }
  }, [fetchAlumni]);

  const filters = useMemo(() => getAlumniFilters(alumniData), [alumniData]);

  const updateFilters = useCallback((key, values) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (!values || values.length === 0) {
        delete newFilters[key];
      } else {
        newFilters[key] = values;
      }
      return newFilters;
    });
  }, []);

  const filterAlumni = useCallback(() => {
    let results = [...alumniData];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (alumni) =>
          alumni.fullName.toLowerCase().includes(searchLower) ||
          alumni.bio.toLowerCase().includes(searchLower) ||
          (alumni.workExperience &&
            alumni.workExperience.some((work) =>
              work.company?.toLowerCase().includes(searchLower)
            )) ||
          (alumni.city && alumni.city.toLowerCase().includes(searchLower))
      );
    }

    // Apply other filters
    results = results.filter((alumni) => {
      return Object.entries(activeFilters).every(([key, values]) => {
        if (!values || values.length === 0) return true;
        switch (key) {
          case 'City':
            return values.some((value) => alumni.city?.includes(value));
          case 'Company':
            return values.some((value) =>
              alumni.workExperience?.some((work) => work.company === value)
            );
          case 'Graduation Year':
            return values.some((value) => alumni.education[0]?.yearOfGraduation === value);
          case 'Skills':
            return values.some((value) => alumni.skills?.includes(value));
          default:
            return true;
        }
      });
    });

    setFilteredData(results);
  }, [search, activeFilters, alumniData]);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    setSearch('');
  }, []);

  const renderItem = useCallback(({ item }) => <UserCard alumni={item} />, []);

  useEffect(() => {
    fetchAlumni();
  }, []);

  // Update filtered data whenever search or filters change
  useEffect(() => {
    filterAlumni();
  }, [filterAlumni]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-text/60 mt-4">Loading alumni...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="mb-4 text-center text-red-500">{error}</Text>
        <TouchableOpacity className="rounded-lg bg-blue-500 px-4 py-2" onPress={fetchAlumni}>
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="border-overlay/10 space-y-3.5 border-b bg-background px-4 pb-3 pt-3.5 shadow-sm">
        <View className="bg-overlay/5 flex-row items-center rounded-xl px-4 py-2.5">
          <Ionicons name="search" size={20} className="text-text/30" />
          <TextInput
            className="ml-3 flex-1 text-base text-text"
            placeholder="Search alumni..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="text-text/40"
          />
          {search && (
            <TouchableOpacity
              onPress={() => setSearch('')}
              className="bg-overlay/10 rounded-full p-2"
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={16} className="text-text/50" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-text/50 text-xs font-medium">
            {Object.keys(activeFilters).length} filters applied
          </Text>
          {Object.keys(activeFilters).length > 0 && (
            <TouchableOpacity
              onPress={clearAllFilters}
              className="bg-accent/10 rounded-lg px-2.5 py-1"
              activeOpacity={0.7}>
              <Text className="text-xs font-medium text-accent">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-1 flex-row space-x-1.5 py-0.5"
          contentContainerStyle={{ paddingHorizontal: 4 }}>
          {Object.entries(filters).map(([key, values]) => (
            <FilterDropdown
              key={key}
              title={key}
              options={values}
              selected={activeFilters[key]}
              onSelect={(value) => updateFilters(key, value)}
              onClear={() => updateFilters(key, null)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{
          padding: 8,
          paddingBottom: 24,
          flexGrow: 1,
          paddingHorizontal: 12,
        }}
        columnWrapperStyle={{
          gap: 12,
          marginBottom: 12,
          justifyContent: 'space-evenly',
          width: '100%',
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={EmptyStateMessage}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0000ff"
            colors={['#0000ff']}
          />
        }
      />
    </View>
  );
};

export default AlumniDirectory;
