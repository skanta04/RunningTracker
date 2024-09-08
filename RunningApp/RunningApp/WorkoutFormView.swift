//
//  WorkoutFormView.swift
//  RunningApp
//
//  Created by Saishreeya Kantamsetty on 9/8/24.
//

import SwiftUI

struct WorkoutFormView: View {
    @State private var date = Date()
    @State private var duration = ""
    @State private var distance = ""
    @State private var heartRate = ""
    @State private var typeOfRun = "race"
    @State private var shoeType = ""
    @State private var name = ""
    
    let runTypes = ["race", "long run", "workout"]
    
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Date")) {
                    DatePicker("Date", selection: $date, displayedComponents: .date)
                }
                
                Section(header: Text(" Input Workout Details")) {
                    TextField("Name", text: $name)
                    
                    TextField("Duration (Minutes)", text: $duration)
                        .keyboardType(.numberPad)
                    TextField("Distance", text: $distance)
                        .keyboardType(.decimalPad)
                    TextField("Heart Rate", text:$heartRate)
                        .keyboardType(.numberPad)
                    Picker("Type of Run", selection: $typeOfRun) {
                        ForEach(runTypes, id: \.self) {
                            Text($0.capitalized)
                        }
                    }
                    TextField("Shoe Type", text: $shoeType)
                }
                
                Section {
                    Button(action: submitWorkout) {
                        Text("Submit Workout")
                    }
                }
            }
            .navigationBarTitle("New Workout")
            
            
        }
        
        
    }
    
    // function to send details to api
    func submitWorkout() {
        guard let durationInt = Int(duration),
              let distanceDouble = Double(distance),
              let heartRateInt = Int(heartRate) else {
            print("Invalid input values")
            return
        }
        // converting date to string
        let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            let formattedDate = dateFormatter.string(from: date)
        
        let workoutData: [String: Any] = [
            "date": formattedDate,
            "duration": durationInt,
            "distance": distanceDouble,
            "heartRate": heartRateInt,
            "typeOfRun": typeOfRun,
            "shoeType": shoeType.isEmpty ? nil : shoeType,
            "name": name
            
        ]
        
        postWorkout(workoutData: workoutData)
        
    }
    
    func postWorkout(workoutData: [String: Any]) {
        guard let url = URL(string: "http://localhost:3000/workouts") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // Convert workout data to JSON
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: workoutData, options: [])
            request.httpBody = jsonData
        } catch {
            print("Error serializing workout data to JSON:", error)
            return
        }
                
        // Execute the request
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error with post request:", error)
                return
            }
                    
            if let response = response as? HTTPURLResponse, response.statusCode == 201 {
                print("Workout successfully submitted")
            } else {
                print("Failed to submit workout")
            }
        }.resume()
    }
}

#Preview {
    WorkoutFormView()
}
