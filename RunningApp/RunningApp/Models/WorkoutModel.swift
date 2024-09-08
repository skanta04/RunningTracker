//
//  WorkoutModel.swift
//  RunningApp
//
//  Created by Saishreeya Kantamsetty on 9/7/24.
//

import Foundation

struct Workout: Codable, Identifiable {
    let id: String
    let date: String
    let duration: Int
    let heartRate: Int
    var typeOfRun: String
    var shoeType: String?
    var name: String
    let image: String?
}
