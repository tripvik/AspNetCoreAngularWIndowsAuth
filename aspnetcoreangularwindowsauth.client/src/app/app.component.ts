import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface UserName {
  username: string;
}

interface UserClaim {
  type: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];
  public userName: string | null = null;
  public userError: string | null = null;
  public userClaims: UserClaim[] = [];
  public claimsError: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getForecasts();
    this.getUserName();
    this.getUserClaims();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getUserName() {
    this.http.get<UserName>('/weatherforecast/username').subscribe(
      (result) => {
        this.userName = result.username;
        this.userError = null; // Clear any previous error
        console.log('Username fetched successfully:', this.userName);
      },
      (error) => {
        console.error('Error fetching username:', error);
        this.userName = null; // Clear any previous username
        if (error.status === 401) {
          this.userError = 'User is not authenticated.';
        } else {
          this.userError = 'Failed to fetch username. Please try again later.';
        }
      }
    );
  }

  getUserClaims() {
    this.http.get<UserClaim[]>('/weatherforecast/claims').subscribe(
      (result) => {
        this.userClaims = result;
        this.claimsError = null;
        console.log('User claims fetched:', this.userClaims);
      },
      (error) => {
        console.error('Error fetching claims:', error);
        this.userClaims = [];
        this.claimsError = 'Failed to fetch user claims.';
      }
    );
  }

  title = 'angularapp1.client';
}
