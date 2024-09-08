//
//  ShowWorkoutsView.swift
//  RunningApp
//
//  Created by Saishreeya Kantamsetty on 9/8/24.
//

import SwiftUI

struct WorkoutListView: View {
    @State private var workouts: [Workout] = []
    
    var body: some View {
        NavigationView {
            List($workouts) { workout in
                VStack(alignment: .leading) {
                    Text(workout.name)
                        .font(.headline)
                    
                    Text("Date: \(workout.date)")
                    Text("Duration: \(workout.duration) min")
                    Text("Distance: \(workout.distance) miles")
                    Text("Heart Rate: \(workout.heartRate) bpm")
                    Text("Type of Run: \(workout.typeOfRun)")
                }
            }
            .navigationBarTitle("All Workouts")
            .onAppear(perform: fetchWorkouts)
        }
    }
    
    // MARK: - Fetch Workouts from API
    func fetchWorkouts() {
        guard let url = URL(string: "http://localhost:3000/workouts") else { return }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Error fetching workouts:", error)
                return
            }
            
            if let data = data {
                do {
                    let decoder = JSONDecoder()
                    let workouts = try decoder.decode([Workout].self, from: data)
                    DispatchQueue.main.async {
                        self.workouts = workouts
                    }
                } catch {
                    print("Error decoding workouts:", error)
                }
            }
        }.resume()
    }
}


#Preview {
    WorkoutListView()
}
