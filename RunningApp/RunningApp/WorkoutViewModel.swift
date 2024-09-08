//
//  WorkoutViewModel.swift
//  RunningApp
//
//  Created by Saishreeya Kantamsetty on 9/7/24.
//

import Foundation

class WorkoutView: ObservableObject {
    @Published var workouts = [Workout]()
    
    func fetchWorkouts() {
        guard let url = URL(string: "http://localhost:3000/workouts") else {
            return
        }
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let data = data {
                if let decodedResponse = try? JSONDecoder().decode([Workout].self, from: data) {
                    DispatchQueue.main.async {
                        self.workouts = decodedResponse
                    }
                }
            }
        }.resume()
    }
}
