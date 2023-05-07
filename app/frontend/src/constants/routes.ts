// export interface Routes {
//   isPrivate: boolean
//   path: string
//   role: string
// }
//
// export const routes = {
//   home: { isPrivate: false, path: '/', role: 'anon' } as Routes,
//   explore: { isPrivate: false, path: '/', role: 'anon' } as Routes,
//   new: { isPrivate: true, path: '/', role: 'anon' } as Routes,
// }
//
// // Let's think about it.
// // We should open the AuthModal within any action that required active user.
// // Then we should navigate the AuthModal according to user choose.
// // - Show auth landing page first.
// //   1. SignIn with Providers
// //   - If user want to sign in or sign up with Google or Apple complete the authentication with it.
// //   - After provider authentication successfully done, show user username, birthdate registering page.
// //   - After username and birthday registering successfully done, return the user last page they were looking at.
// //   2. SignUp with Password
// //   - If user choose Create Account option route the user email, password and agreement modal.
// //   - After password authentication successfully done,  show user username, birthday registering page.
// //   - After username and birthday registering successfully done, return the user last page they were looking at.
//
// // Two type of authentication check
// // - Page/Component authentication. Uses <Link />
// // - Action authentication. Uses onClick
