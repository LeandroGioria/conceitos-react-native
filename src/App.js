import React, {useEffect, useState} from "react";


import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function loadRepositories() {
      try {
         const response = await api.get('repositories');

         console.log(response.data);
         setRepositories(response.data);
      } catch (err) {
          console.log('Error to load repositories');
      }
    }

    loadRepositories();
  }, [])

  async function handleLikeRepository(id) {
      try {
        console.log(`repositories/${id}/like`);
        const response = await api.post(`repositories/${id}/like`);

        //find the index of object from array that you want to update
        const repositoryIndex = repositories.findIndex(repository => repository.id === id);
        // make final new array of objects by combining updated object.
        setRepositories([...repositories.slice(0, repositoryIndex), response.data,...repositories.slice(repositoryIndex + 1)]);
      } catch (err) {
          console.log('Error to like repository')
      }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          style={styles.repositoryContainer} 
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View>
                <Text key={repository.id} style={styles.repository}>{repository.title}</Text>

                <View style={styles.techsContainer}>
                   {repository.techs.map((tech, index) => (
                      <Text key={index} style={styles.tech}>
                        {tech}
                      </Text>
                   ))}
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {repository.likes} {repository.likes === 0 ? 'curtida' : 'curtidas'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
            </View>
          )}
        />        
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
