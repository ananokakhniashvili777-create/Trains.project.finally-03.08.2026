import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './services/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  currentTab: 'home' | 'trains' | 'train-detail' | 'login' | 'register' = 'home';
  activeDetailTab: 'schedules' | 'coaches' = 'schedules';

  // ავტორიზაციის ცვლადები
  loginData = {
    email: '',
    password: ''
  };
  rememberMe: boolean = false;
  loginError: string = '';

  // რეგისტრაციის ცვლადები
  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  allTrainsMaster: any[] = [];
  trains: any[] = [];
  stations: any[] = [];

  homeFrom: string = '';
  homeTo: string = '';
  searchTrainName: string = '';
  selectedFromStation: string = '';
  selectedToStation: string = '';

  selectedTrain: any = null;
  selectedTrainSchedules: any[] = [];
  selectedTrainCoaches: any[] = [];

  trainImages = [
    'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/b4/b6/ba/3b/33/v1_E10/E108V3V5.jpg?w=1600&cf_fit=scale-down&q=85&format=auto&s=90657bc91abc9175c52a90e703d14c91200d10ac61622b5685185d51160a3f65',
    'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/cc/28/f9/9a/54/v1_E10/E1062D23.jpg?w=1600&cf_fit=scale-down&q=85&format=auto&s=8c06bd438bce2c2973960f4a46bf90531ed8dfe7fbba83b7ec6a6150a7128a10',
    'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/84/c3/4f/e6/d4/v1_E11/E113X0VH.JPG?w=1600&cf_fit=scale-down&q=85&format=auto&s=6807b47e8e3069419166d269fcf530f5846983c4b4c008a4ee605c9c704d828f',
    'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/66/b0/15/67/3b/v1_E11/E118KR0I.jpg?w=1600&cf_fit=scale-down&q=85&format=auto&s=43531eb984a32260da2b7e2bea94f9f47e8f9b6f2e6445e132505ac0e9e6d341',
    'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/b7/c1/75/2a/29/v1_E11/E11HXF6.jpg?w=1600&cf_fit=scale-down&q=85&format=auto&s=c58f1d6be0135829c516623f2cafb7c621a36d5dbc070a3f12b327be936ceacd'
  ];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.initData();

    // Query Params წაკითხვა ლინკიდან
    this.route.queryParams.subscribe(params => {
      const fromParam = params['from'];
      const toParam = params['to'];

      if (fromParam || toParam) {
        this.selectedFromStation = fromParam || '';
        this.selectedToStation = toParam || '';
        this.currentTab = 'trains';
        this.onApplyRouteFilter();
      }
    });
  }

  setTab(tab: 'home' | 'trains' | 'train-detail' | 'login' | 'register') {
    this.currentTab = tab;
  }

  onLogin() {
    this.loginError = '';
    
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
        alert('ავტორიზაცია წარმატებით გაიარა!');
        this.setTab('home');
      },
      error: (err) => {
        console.error('შეცდომა შესვლისას:', err);
        this.loginError = 'არასწორი ელ.ფოსტა ან პაროლი!';
      }
    });
  }

  onRegister() {
    if (!this.registerData.email || !this.registerData.password) {
      alert('გთხოვთ შეავსოთ ყველა აუცილებელი ველი!');
      return;
    }
    
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('პაროლები ერთმანეთს არ ემთხვევა!');
      return;
    }

    alert('ანგარიში წარმატებით შეიქმნა!');
    this.setTab('login');
  }

  initData() {
    this.stations = [
      { id: 'Tbilisi Central Station', name: 'Tbilisi Central Station' },
      { id: 'Batumi Central Station', name: 'Batumi Central Station' },
      { id: 'Kutaisi Station', name: 'Kutaisi Station' },
      { id: 'Zugdidi Station', name: 'Zugdidi Station' },
      { id: 'Borjomi-Bakuriani Station', name: 'Borjomi-Bakuriani Station' }
    ];

    this.allTrainsMaster = [
      {
        id: 101,
        number: 'TRAIN #101',
        name: 'Tbilisi Express',
        coachesCount: 3,
        seatsCount: 60,
        schedulesCount: 2,
        schedules: [
          { origin: 'Tbilisi Central Station', destination: 'Batumi Central Station', time: '08:00' },
          { origin: 'Batumi Central Station', destination: 'Tbilisi Central Station', time: '16:00' }
        ],
        coaches: [
          { name: 'Coach 1 - First Class', seats: 20 },
          { name: 'Coach 2 - Second Class', seats: 20 },
          { name: 'Coach 3 - Second Class', seats: 20 }
        ]
      },
      {
        id: 202,
        number: 'TRAIN #202',
        name: 'Batumi Bullet',
        coachesCount: 3,
        seatsCount: 60,
        schedulesCount: 2,
        schedules: [
          { origin: 'Batumi Central Station', destination: 'Tbilisi Central Station', time: '09:30' },
          { origin: 'Tbilisi Central Station', destination: 'Batumi Central Station', time: '14:00' }
        ],
        coaches: [
          { name: 'Coach 1 - First Class', seats: 20 },
          { name: 'Coach 2 - Second Class', seats: 20 },
          { name: 'Coach 3 - Second Class', seats: 20 }
        ]
      },
      {
        id: 303,
        number: 'TRAIN #303',
        name: 'Imereti Express',
        coachesCount: 3,
        seatsCount: 60,
        schedulesCount: 2,
        schedules: [
          { origin: 'Tbilisi Central Station', destination: 'Kutaisi Station', time: '10:00' },
          { origin: 'Kutaisi Station', destination: 'Tbilisi Central Station', time: '15:30' }
        ],
        coaches: [
          { name: 'Coach 1 - First Class', seats: 20 },
          { name: 'Coach 2 - Second Class', seats: 20 },
          { name: 'Coach 3 - Second Class', seats: 20 }
        ]
      },
      {
        id: 404,
        number: 'TRAIN #404',
        name: 'Kolkheti Express',
        coachesCount: 3,
        seatsCount: 60,
        schedulesCount: 2,
        schedules: [
          { origin: 'Tbilisi Central Station', destination: 'Zugdidi Station', time: '07:15' },
          { origin: 'Zugdidi Station', destination: 'Tbilisi Central Station', time: '13:00' }
        ],
        coaches: [
          { name: 'Coach 1 - First Class', seats: 20 },
          { name: 'Coach 2 - Second Class', seats: 20 },
          { name: 'Coach 3 - Second Class', seats: 20 }
        ]
      },
      {
        id: 505,
        number: 'TRAIN #505',
        name: 'Borjomi Line',
        coachesCount: 3,
        seatsCount: 60,
        schedulesCount: 2,
        schedules: [
          { origin: 'Tbilisi Central Station', destination: 'Borjomi-Bakuriani Station', time: '11:00' },
          { origin: 'Borjomi-Bakuriani Station', destination: 'Tbilisi Central Station', time: '17:30' }
        ],
        coaches: [
          { name: 'Coach 1 - First Class', seats: 20 },
          { name: 'Coach 2 - Second Class', seats: 20 },
          { name: 'Coach 3 - Second Class', seats: 20 }
        ]
      }
    ];

    this.trains = [...this.allTrainsMaster];
  }

  onHomeSearch() {
    this.selectedFromStation = this.homeFrom;
    this.selectedToStation = this.homeTo;
    
    const queryParams = new URLSearchParams();
    if (this.homeFrom) queryParams.set('from', this.homeFrom);
    if (this.homeTo) queryParams.set('to', this.homeTo);
    
    const newUrl = queryParams.toString() ? `?${queryParams.toString()}` : '';
    this.location.go(newUrl);

    this.currentTab = 'trains';
    this.onApplyRouteFilter();
  }

  onSearchByName() {
    const query = this.searchTrainName.trim().toLowerCase();
    
    if (!query) {
      this.trains = [...this.allTrainsMaster];
      return;
    }

    this.trains = this.allTrainsMaster.filter(t => {
      const matchName = t.name.toLowerCase().includes(query);
      const matchNum = t.number.toLowerCase().includes(query);
      const matchSched = t.schedules.some((s: any) => 
        s.origin.toLowerCase().includes(query) || 
        s.destination.toLowerCase().includes(query)
      );
      return matchName || matchNum || matchSched;
    });
  }

  onApplyRouteFilter() {
    const fromQuery = this.selectedFromStation.trim().toLowerCase();
    const toQuery = this.selectedToStation.trim().toLowerCase();

    if (!fromQuery && !toQuery) {
      this.trains = [...this.allTrainsMaster];
      return;
    }

    this.trains = this.allTrainsMaster.filter(t => {
      return t.schedules.some((s: any) => {
        const orig = s.origin.toLowerCase();
        const dest = s.destination.toLowerCase();

        const matchFrom = !fromQuery || orig.includes(fromQuery);
        const matchTo = !toQuery || dest.includes(toQuery);

        return matchFrom && matchTo;
      });
    });
  }

  clearFilters() {
    this.searchTrainName = '';
    this.selectedFromStation = '';
    this.selectedToStation = '';
    this.location.go('');
    this.trains = [...this.allTrainsMaster];
  }

  selectTrain(train: any, index: number) {
    this.selectedTrain = { ...train, imageIndex: index };
    this.selectedTrainSchedules = train.schedules || [];
    this.selectedTrainCoaches = train.coaches || [];
    this.activeDetailTab = 'schedules';
    this.currentTab = 'train-detail';
  }

  getImage(index: number): string {
    return this.trainImages[index % this.trainImages.length];
  }
}