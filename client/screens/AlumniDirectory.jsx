import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';

import { alumniRecommendations, getAlumniFilters } from '../constants/alumni/alumniRecommendations';

const AlumniCard = ({ alumni, onConnect }) => (
  <View className="border-overlay/20 m-1.5 flex-1 rounded-xl border bg-background p-4 shadow-md">
    <View className="mb-2 flex-row items-center justify-end">
      <View className="bg-primary/10 rounded-full px-2 py-0.5">
        <Text className="text-2xs text-primary">{alumni.department}</Text>
      </View>
    </View>
    <Image
      source={{ uri: alumni.photo }}
      className="border-primary/20 h-20 w-20 self-center rounded-full border-2"
    />
    <Text className="mt-2 text-center text-sm font-bold text-text" numberOfLines={1}>
      {alumni.name}
    </Text>
    <Text className="text-primary/80 text-center text-xs" numberOfLines={1}>
      {alumni.position}
    </Text>
    <Text className="text-text/60 text-center text-xs" numberOfLines={1}>
      {alumni.company}
    </Text>
    <Text className="text-2xs text-text/40 text-center">
      {alumni.batch.joining} - {alumni.batch.graduation}
    </Text>
    <TouchableOpacity
      className={`mt-3 rounded-full px-4 py-2 shadow-sm ${
        alumni.isConnected ? 'bg-overlay' : 'bg-gradient-to-r from-primary to-secondary'
      }`}
      onPress={() => onConnect(alumni.id)}
      disabled={alumni.isConnected}
      activeOpacity={0.7}>
      <Text
        className={`text-center text-xs font-medium ${alumni.isConnected ? 'text-text/60' : 'text-background'}`}>
        {alumni.isConnected ? 'Connected' : 'Connect'}
      </Text>
    </TouchableOpacity>
  </View>
);

const FilterDropdown = ({ title, options, selected = [], onSelect, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onSelect(newSelected);
  };

  return (
    <View className="z-10 mr-2">
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className={`flex-row items-center rounded-lg px-3 py-2 ${
          selected.length > 0 ? 'bg-accent/10' : 'bg-overlay'
        }`}>
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
          onRequestClose={() => setIsOpen(false)}>
          <TouchableOpacity
            className="bg-overlay/80 flex-1"
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
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
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
  const [filteredData, setFilteredData] = useState(alumniRecommendations);
  const [activeFilters, setActiveFilters] = useState({});

  const filters = useMemo(() => getAlumniFilters(alumniRecommendations), []);

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
    let results = [...alumniRecommendations];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (alumni) =>
          alumni.name.toLowerCase().includes(searchLower) ||
          alumni.company.toLowerCase().includes(searchLower) ||
          alumni.position.toLowerCase().includes(searchLower) ||
          alumni.location.toLowerCase().includes(searchLower) ||
          alumni.skills.some((skill) => skill.toLowerCase().includes(searchLower))
      );
    }

    // Apply other filters
    results = results.filter((alumni) => {
      return Object.entries(activeFilters).every(([key, values]) => {
        if (!values || values.length === 0) return true;
        switch (key) {
          case 'Joining Year':
            return values.includes(alumni.batch.joining);
          case 'Graduation Year':
            return values.includes(alumni.batch.graduation);
          case 'Location':
            return values.some((value) => alumni.location.includes(value));
          case 'Industry':
            return values.includes(alumni.industry);
          case 'Department':
            return values.includes(alumni.department);
          case 'Skills':
            return values.some((value) => alumni.skills.includes(value));
          default:
            return true;
        }
      });
    });

    setFilteredData(results);
  }, [search, activeFilters]);

  // Update filtered data whenever search or filters change
  React.useEffect(() => {
    filterAlumni();
  }, [filterAlumni]);

  const handleConnect = useCallback((id) => {
    // Implement connection logic here
    console.log('Connecting with alumni:', id);
  }, []);

  const renderItem = ({ item }) => <AlumniCard alumni={item} onConnect={handleConnect} />;

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    setSearch('');
  }, []);

  return (
    <View className="flex-1 bg-background">
      <View className="border-overlay/10 space-y-4 border-b bg-background px-4 pb-3 pt-4 shadow-sm">
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
              className="bg-overlay/10 active:bg-overlay/20 rounded-full p-1.5"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} className="text-text/50" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row items-center justify-between px-0.5">
          <Text className="text-text/50 text-xs font-medium">
            {Object.keys(activeFilters).length} filters applied
          </Text>
          {Object.keys(activeFilters).length > 0 && (
            <TouchableOpacity
              onPress={clearAllFilters}
              className="bg-accent/10 rounded-lg px-3 py-1.5"
              activeOpacity={0.7}>
              <Text className="text-xs font-medium text-accent">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-1 space-x-2 py-1"
          contentContainerStyle={{ paddingHorizontal: 1 }}>
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
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          padding: 8,
          flexGrow: 1, // This helps center the empty state
        }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={EmptyStateMessage}
      />
    </View>
  );
};

export default AlumniDirectory;
