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

import { alumniRecommendations, getAlumniFilters } from '../constants/alumniData';

const AlumniCard = ({ alumni, onConnect }) => (
  <View className="m-2 flex-1 rounded-xl bg-white p-4 shadow-md">
    <View className="mb-2 flex-row items-center justify-end">
      <View className="rounded-full bg-primary/10 px-2 py-1">
        <Text className="text-xs text-primary">{alumni.department}</Text>
      </View>
    </View>
    <Image
      source={alumni.photo}
      className="h-24 w-24 self-center rounded-full border-2 border-primary/20"
    />
    <Text className="mt-3 text-center text-lg font-bold text-gray-800">{alumni.name}</Text>
    <Text className="text-center text-primary/80">{alumni.position}</Text>
    <Text className="text-center text-gray-500">{alumni.company}</Text>
    <Text className="text-center text-gray-400">
      Batch {alumni.batch.joining} - {alumni.batch.graduation}
    </Text>
    <TouchableOpacity
      className={`mt-3 rounded-full ${
        alumni.isConnected ? 'bg-gray-100' : 'bg-gradient-to-r from-primary to-secondary'
      } px-4 py-2.5 shadow-sm`}
      onPress={() => onConnect(alumni.id)}
      disabled={alumni.isConnected}>
      <Text
        className={`text-center font-medium ${alumni.isConnected ? 'text-gray-600' : 'text-white'}`}>
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
    <View className="mr-4" style={{ zIndex: 10 }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className={`flex-row items-center rounded-lg px-3 py-2 ${
          selected.length > 0 ? 'bg-primary/20' : 'bg-gray-200'
        }`}>
        <Text className="mr-2 font-semibold">
          {title} {selected.length > 0 && `(${selected.length})`}
        </Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} />
      </TouchableOpacity>

      {isOpen && (
        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}>
          <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={() => setIsOpen(false)}>
            <View className="m-4 mt-20 rounded-lg bg-white p-4">
              <Text className="mb-2 text-lg font-bold">{title}</Text>
              <ScrollView className="max-h-80">
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    className={`mb-2 rounded-lg p-3 ${
                      selected.includes(option) ? 'bg-primary' : 'bg-gray-100'
                    }`}
                    onPress={() => handleSelect(option)}>
                    <Text className={selected.includes(option) ? 'text-white' : 'text-gray-800'}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {selected.length > 0 && (
                <TouchableOpacity
                  className="mt-2 rounded-lg bg-red-100 p-3"
                  onPress={() => {
                    onClear();
                    setIsOpen(false);
                  }}>
                  <Text className="text-center text-red-500">Clear Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

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
      <View className="space-y-4 bg-white p-4 shadow-sm">
        <View className="shadow-inner flex-row items-center rounded-2xl bg-gray-50 px-4 py-3">
          <Ionicons name="search" size={20} color="#4B5563" />
          <TextInput
            className="ml-2 flex-1 font-medium text-gray-700"
            placeholder="Search alumni..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#4B5563" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium text-gray-500">
            {Object.keys(activeFilters).length} filters applied
          </Text>
          {Object.keys(activeFilters).length > 0 && (
            <TouchableOpacity onPress={clearAllFilters} className="rounded-lg bg-red-50 px-3 py-1">
              <Text className="text-sm font-medium text-red-500">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-2">
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
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={
          <View className="mt-8 items-center justify-center">
            <Text className="text-lg font-medium text-gray-500">No alumni found</Text>
            <Text className="text-sm text-gray-400">Try adjusting your filters</Text>
          </View>
        }
      />
    </View>
  );
};

export default AlumniDirectory;
